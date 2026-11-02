
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

const WALL_ITEM_RISE = 0.55 * 280;

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

export function floorTileToPx(gx: number, gy: number): Px {
  const { u, v } = gridUV(gx, gy);
  return quadPoint(u, v);
}

function wallSlotBase(side: WallSide, slot: number): Px {
  const t = slot / (GRID_SIZE - 1);
  return side === "left" ? quadPoint(0, t) : quadPoint(t, 0);
}

export function wallSlotToPx(side: WallSide, slot: number): Px {
  return wallSlotBase(side, slot);
}

export function wallSlotAnchorPx(side: WallSide, slot: number): Px {
  const base = wallSlotBase(side, slot);
  return { x: base.x, y: base.y - WALL_ITEM_RISE };
}

export function floorTileCellPoints(gx: number, gy: number): string {
  const { u, v } = gridUV(gx, gy);
  const du = 0.5 / (GRID_SIZE - 1);
  const dv = 0.5 / (GRID_SIZE - 1);
  const corners = [quadPoint(u, v - dv), quadPoint(u + du, v), quadPoint(u, v + dv), quadPoint(u - du, v)];
  return corners.map((p) => `${p.x},${p.y}`).join(" ");
}

export const WALL_SLOT_HIGHLIGHT_W = 90;
export const WALL_SLOT_HIGHLIGHT_H = 200;

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
  const edge = side === "left" ? E_V : E_U;
  const dx = point.x - TOP.x;
  const dy = point.y - TOP.y;
  const len2 = edge.x * edge.x + edge.y * edge.y;
  const t = (dx * edge.x + dy * edge.y) / len2;
  return Math.round(Math.min(1, Math.max(0, t)) * (GRID_SIZE - 1));
}

export function clientZIndex(x: number, y: number, wallSide: WallSide | null): number {
  if (wallSide) return -1000 + x;
  return (x + y) * 10;
}
