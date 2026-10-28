// Isometric tile-grid math for the room, calibrated against the actual
// drawn floor in /game/room-bg.png (not an idealized diamond) so tiles line
// up with the art instead of floating over the walls/railing.
//
// Everything here works in the IMAGE'S OWN PIXEL SPACE (1125x1195). The
// overlay in RoomPage is an <svg viewBox="0 0 1125 1195"
// preserveAspectRatio="xMidYMid meet">, which is the browser doing the
// exact same "contain" fit as the background's CSS background-size:contain
// — natively, with no JS measurement to get out of sync. That's what makes
// a raw pixel coordinate here always land on the same spot of the art,
// regardless of window size, with no ResizeObserver involved.
//
// The floor is a slightly irregular quad (the art isn't a perfect
// parallelogram), measured by flood-filling the floor's wood color and
// taking the extreme points:
//   back/top corner:    (555, 449)
//   right corner:        (971, 719)
//   front/bottom corner: (561, 1017)
//   left corner:         (146, 703)
import type { WallSide } from "../types";

export const IMAGE_W = 1125;
export const IMAGE_H = 1195;

export const GRID_SIZE = 6;

export interface Px {
  x: number;
  y: number;
}

const TOP: Px = { x: 555, y: 449 };
const RIGHT: Px = { x: 971, y: 719 };
const BOTTOM: Px = { x: 561, y: 1017 };
const LEFT: Px = { x: 146, y: 703 };

// How far above its wall-edge point a wall-hung item (frame, clock, ...)
// should render, in image pixels. ~55% up a ~280px wall.
const WALL_ITEM_RISE = 0.55 * 280;

// Bilinear interpolation across the measured quad: u runs TOP->RIGHT (gx),
// v runs TOP->LEFT (gy). u=v=0 is TOP, u=1,v=0 is RIGHT, u=0,v=1 is LEFT,
// u=v=1 is BOTTOM.
function quadPoint(u: number, v: number): Px {
  const w00 = (1 - u) * (1 - v);
  const w10 = u * (1 - v);
  const w01 = (1 - u) * v;
  const w11 = u * v;
  return {
    x: w00 * TOP.x + w10 * RIGHT.x + w01 * LEFT.x + w11 * BOTTOM.x,
    y: w00 * TOP.y + w10 * RIGHT.y + w01 * LEFT.y + w11 * BOTTOM.y,
  };
}

function gridUV(gx: number, gy: number) {
  return { u: gx / (GRID_SIZE - 1), v: gy / (GRID_SIZE - 1) };
}

/** Floor tile (gx, gy) -> its anchor point (tile center), in image pixels. */
export function floorTileToPx(gx: number, gy: number): Px {
  const { u, v } = gridUV(gx, gy);
  return quadPoint(u, v);
}

/** Wall slot -> the point on the floor where that wall panel's base sits. */
function wallSlotBase(side: WallSide, slot: number): Px {
  const t = slot / (GRID_SIZE - 1);
  // left wall = TOP->LEFT edge (u=0), right wall = TOP->RIGHT edge (v=0)
  return side === "left" ? quadPoint(0, t) : quadPoint(t, 0);
}

export function wallSlotToPx(side: WallSide, slot: number): Px {
  return wallSlotBase(side, slot);
}

/** Where a wall-hung item should actually render: raised up off the floor edge. */
export function wallSlotAnchorPx(side: WallSide, slot: number): Px {
  const base = wallSlotBase(side, slot);
  return { x: base.x, y: base.y - WALL_ITEM_RISE };
}

/** The 4 corners (as an SVG points="" string) of one floor tile cell. */
export function floorTileCellPoints(gx: number, gy: number): string {
  const { u, v } = gridUV(gx, gy);
  const du = 0.5 / (GRID_SIZE - 1);
  const dv = 0.5 / (GRID_SIZE - 1);
  const corners = [quadPoint(u, v - dv), quadPoint(u + du, v), quadPoint(u, v + dv), quadPoint(u - du, v)];
  return corners.map((p) => `${p.x},${p.y}`).join(" ");
}

export const WALL_SLOT_HIGHLIGHT_W = 90;
export const WALL_SLOT_HIGHLIGHT_H = 200;

// Nearest-tile lookup inverts the quad approximately as a parallelogram
// (ignoring the small bow from a perfect parallelogram) -- plenty accurate
// for snapping a drag/click to the closest tile.
const E_U: Px = { x: RIGHT.x - TOP.x, y: RIGHT.y - TOP.y };
const E_V: Px = { x: LEFT.x - TOP.x, y: LEFT.y - TOP.y };
const DET = E_U.x * E_V.y - E_V.x * E_U.y;

export function nearestFloorTile(point: Px): { gx: number; gy: number } {
  const dx = point.x - TOP.x;
  const dy = point.y - TOP.y;
  const u = (E_V.y * dx - E_V.x * dy) / DET;
  const v = (-E_U.y * dx + E_U.x * dy) / DET;
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  return {
    gx: Math.round(clamp01(u) * (GRID_SIZE - 1)),
    gy: Math.round(clamp01(v) * (GRID_SIZE - 1)),
  };
}

export function nearestWallSlot(side: WallSide, point: Px): number {
  // Project onto the TOP->LEFT (left wall) or TOP->RIGHT (right wall) edge.
  const edge = side === "left" ? E_V : E_U;
  const dx = point.x - TOP.x;
  const dy = point.y - TOP.y;
  const len2 = edge.x * edge.x + edge.y * edge.y;
  const t = (dx * edge.x + dy * edge.y) / len2;
  return Math.round(Math.min(1, Math.max(0, t)) * (GRID_SIZE - 1));
}

/** Same ordering rule as the backend's compute_z_index, for the drag ghost. */
export function clientZIndex(x: number, y: number, wallSide: WallSide | null): number {
  if (wallSide) return -1000 + x;
  return (x + y) * 10;
}
