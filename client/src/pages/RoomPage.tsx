import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useNavigate } from "react-router";
import { FlipHorizontalIcon, MinusIcon, PlusIcon, SparklesIcon, TrashIcon } from "../components/icons";
import { ErrorNotice, LoadingText } from "../components/Status";
import { useRoom } from "../hooks/useRoom";
import {
  GRID_SIZE,
  IMAGE_H,
  IMAGE_W,
  WALL_SLOT_HIGHLIGHT_H,
  WALL_SLOT_HIGHLIGHT_W,
  floorTileCellPoints,
  floorTileToPx,
  nearestFloorTile,
  nearestWallSlot,
  wallSlotAnchorPx,
  wallSlotToPx,
  type Px,
} from "../lib/roomGrid";
import type { InventoryItem, RoomItem as RoomItemT, WallSide } from "../types";

// Rarity doubles as the furniture's loot-tier color, used for both the
// inventory slot border/glow and the placed item's drop shadow. Colors
// match the site's own accent tokens (brick/moss) rather than a separate
// game palette.
const RARITY_STYLE: Record<string, { border: string; glow: string; text: string; rgb: string }> = {
  common: { border: "border-line-strong", glow: "", text: "text-ink-muted", rgb: "154,151,125" },
  rare: { border: "border-teal/55", glow: "shadow-[0_0_14px_-2px_rgba(62,107,92,0.4)]", text: "text-teal", rgb: "62,107,92" },
  epic: { border: "border-violet/65", glow: "shadow-[0_0_16px_-2px_rgba(182,81,47,0.4)]", text: "text-violet", rgb: "182,81,47" },
};

const ITEM_BOX = 150; // image-pixel box a placed item's art is fit into

// A target the ghost/cursor can snap to: a floor tile, or a slot on one of
// the two back walls.
type GridTarget = { x: number; y: number; wallSide: WallSide | null };

function occupiedKey(x: number, y: number, wallSide: WallSide | null) {
  return wallSide ? `w:${wallSide}:${x}` : `f:${x}:${y}`;
}

export function RoomPage() {
  const navigate = useNavigate();
  const {
    inventory,
    roomItems,
    isLoading,
    error,
    placeError,
    refetch,
    placeItem,
    moveItem,
    toggleFlip,
    setScale,
    removeItem,
  } = useRoom();

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dragId, setDragId] = useState<number | null>(null);
  const [dragTarget, setDragTarget] = useState<GridTarget | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Set while the player has tapped an inventory item and is choosing where
  // to put it — the grid lights up and the next tile/slot click places it.
  const [placingItem, setPlacingItem] = useState<InventoryItem | null>(null);

  const occupied = useMemo(() => {
    const set = new Set<string>();
    for (const item of roomItems) {
      if (item.room_item_id === dragId) continue;
      set.add(occupiedKey(item.x, item.y, item.wall_side));
    }
    return set;
  }, [roomItems, dragId]);

  const draggingItem = dragId !== null ? roomItems.find((i) => i.room_item_id === dragId) ?? null : null;
  // Which zone the grid should highlight right now, and — for a dragging
  // wall item — which side it's locked to (switching walls mid-drag would
  // be confusing, so it just slides along its own wall).
  const activeZone = placingItem?.placement_zone ?? (draggingItem ? (draggingItem.wall_side ? "wall" : "floor") : null);
  const lockedWallSide = draggingItem?.wall_side ?? null;

  // Client (screen) px -> the SVG's own viewBox coordinate space (image
  // pixels). getScreenCTM is the browser's real transform for whatever
  // preserveAspectRatio just did, so this always lands exactly where the
  // art is drawn, including any contain-fit letterboxing — no manual fit
  // math, nothing to get out of sync with a resize.
  const clientToImagePx = (clientX: number, clientY: number): Px => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: IMAGE_W / 2, y: IMAGE_H / 2 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.min(IMAGE_W, Math.max(0, p.x)),
      y: Math.min(IMAGE_H, Math.max(0, p.y)),
    };
  };

  // The reverse: an image-pixel point -> screen px relative to the canvas,
  // for positioning the (plain HTML) selection toolbar over an SVG item.
  const imagePxToContainerPoint = (ix: number, iy: number): Px => {
    const svg = svgRef.current;
    const container = canvasRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !container || !ctm) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = ix;
    pt.y = iy;
    const screenPt = pt.matrixTransform(ctm);
    const rect = container.getBoundingClientRect();
    return { x: screenPt.x - rect.left, y: screenPt.y - rect.top };
  };

  const snapToGrid = (clientX: number, clientY: number): GridTarget => {
    const point = clientToImagePx(clientX, clientY);
    if (activeZone === "wall") {
      if (lockedWallSide) {
        return { x: nearestWallSlot(lockedWallSide, point), y: 0, wallSide: lockedWallSide };
      }
      // Placing fresh: whichever wall edge is closer wins.
      const leftSlot = nearestWallSlot("left", point);
      const rightSlot = nearestWallSlot("right", point);
      const leftPt = wallSlotToPx("left", leftSlot);
      const rightPt = wallSlotToPx("right", rightSlot);
      const dLeft = (leftPt.x - point.x) ** 2 + (leftPt.y - point.y) ** 2;
      const dRight = (rightPt.x - point.x) ** 2 + (rightPt.y - point.y) ** 2;
      return dLeft <= dRight
        ? { x: leftSlot, y: 0, wallSide: "left" }
        : { x: rightSlot, y: 0, wallSide: "right" };
    }
    const { gx, gy } = nearestFloorTile(point);
    return { x: gx, y: gy, wallSide: null };
  };

  const handlePointerDown = (item: RoomItemT) => (e: ReactPointerEvent<SVGGElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlacingItem(null);
    setDragId(item.room_item_id);
    setSelectedId(item.room_item_id);
    setDragTarget({ x: item.x, y: item.y, wallSide: item.wall_side });
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragId === null) return;
    setDragTarget(snapToGrid(e.clientX, e.clientY));
  };

  const endDrag = async (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragId === null) return;
    const id = dragId;
    const target = dragTarget ?? snapToGrid(e.clientX, e.clientY);
    setDragId(null);
    setDragTarget(null);
    if (occupied.has(occupiedKey(target.x, target.y, target.wallSide))) return; // snaps back
    await moveItem(id, target.x, target.y, target.wallSide);
  };

  const handleCanvasClick = async (e: ReactPointerEvent<HTMLDivElement>) => {
    if (placingItem) {
      const target = snapToGrid(e.clientX, e.clientY);
      if (occupied.has(occupiedKey(target.x, target.y, target.wallSide))) return;
      const ok = await placeItem(placingItem.id, target.x, target.y, target.wallSide);
      if (ok) setPlacingItem(null);
      return;
    }
    setSelectedId(null);
  };

  const startPlacing = (item: InventoryItem) => {
    if (item.available <= 0) return;
    setSelectedId(null);
    setPlacingItem(item);
  };

  const itemAnchor = (x: number, y: number, wallSide: WallSide | null): Px =>
    wallSide ? wallSlotAnchorPx(wallSide, x) : floorTileToPx(x, y);

  const selectedItem = roomItems.find((i) => i.room_item_id === selectedId) ?? null;
  const gridVisible = placingItem !== null || dragId !== null;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-app">
        <LoadingText label="Loading your room..." />
      </div>
    );
  }

  const itemsEarned = inventory.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-app">
      <div className="flex flex-shrink-0 items-center justify-between border-b-[1.5px] border-ink bg-panel px-5 py-2.75">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-line-strong px-2.75 py-1.25 text-[12px] font-medium text-ink-dim hover:border-ink hover:text-ink"
        >
          <span className="text-[14px] leading-none">‹</span>
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rotate-45 bg-violet" />
          <h1 className="font-display m-0 text-[18px] font-medium italic tracking-tight text-ink">My Room</h1>
          <span className="h-1.5 w-1.5 rotate-45 bg-violet" />
        </div>

        <div className="flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-ink bg-violet/12 px-2.75 py-1 text-[12px] font-semibold text-violet">
          <SparklesIcon size={12} />
          <span>{itemsEarned} collected</span>
        </div>
      </div>

      {error && (
        <div className="flex-shrink-0 px-4 pt-3">
          <ErrorNotice message={error} onRetry={refetch} />
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
        {placingItem && (
          <div className="animate-fade-in-up absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-[6px] border-[1.5px] border-ink bg-panel px-4 py-2 text-[12px] text-ink shadow-[var(--shadow-sticker)]">
            <span className="animate-hud-pulse h-1.5 w-1.5 rounded-full bg-violet" />
            <span>
              Tap a glowing {placingItem.placement_zone === "wall" ? "wall slot" : "floor tile"} to place{" "}
              <span className="font-medium text-violet">{placingItem.name}</span>
            </span>
            <button onClick={() => setPlacingItem(null)} className="font-medium text-ink-muted hover:text-ink">
              Cancel
            </button>
          </div>
        )}
        {placeError && !placingItem && (
          <div className="animate-fade-in-up absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-[6px] border-[1.5px] border-ink bg-panel px-4 py-2 text-[12px] font-medium text-danger shadow-[var(--shadow-sticker)]">
            {placeError}
          </div>
        )}

        <div
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={handleCanvasClick}
          className="relative flex-1 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-[#14110c] shadow-[var(--shadow-sticker)]"
          style={{
            // The room art itself: plain CSS contain-fit, nothing can break this.
            backgroundImage: "url(/game/room-bg.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Vignette + game-viewport corner brackets — purely decorative chrome
              that reads as a HUD frame rather than a flat content card. */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{ boxShadow: "inset 0 0 90px 10px rgba(0,0,0,0.55)" }}
          />
          <ViewportCorners />

          {roomItems.length === 0 && !gridVisible && (
            <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-[12.5px] text-ink-faint">
              Answer quiz questions correctly to earn furniture, then place it here.
            </p>
          )}

          {/* Same viewBox + preserveAspectRatio as the background's own
              contain-fit, done natively by the SVG instead of guessed at in
              JS — so a raw image-pixel coordinate here always lands on the
              exact same spot as the art behind it, at any window size. */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {gridVisible && (
              <GridOverlay
                activeZone={activeZone}
                lockedWallSide={lockedWallSide}
                occupied={occupied}
                target={dragTarget}
              />
            )}

            {roomItems.map((item) => {
              const dragging = dragId === item.room_item_id;
              const pos = dragging && dragTarget
                ? dragTarget
                : { x: item.x, y: item.y, wallSide: item.wall_side };
              const anchor = itemAnchor(pos.x, pos.y, pos.wallSide);
              const selected = selectedId === item.room_item_id;
              const scale = item.scale / 100;
              const rarity = RARITY_STYLE[item.rarity] ?? RARITY_STYLE.common;

              return (
                <g
                  key={item.room_item_id}
                  onPointerDown={handlePointerDown(item)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (placingItem) return;
                    setSelectedId(item.room_item_id);
                  }}
                  transform={`translate(${anchor.x} ${anchor.y}) scale(${item.flipped ? -scale : scale} ${scale})`}
                  style={{ cursor: "grab" }}
                  className={dragging ? "" : undefined}
                >
                  {selected && (
                    <rect
                      x={-ITEM_BOX / 2 - 8}
                      y={-ITEM_BOX / 2 - 8}
                      width={ITEM_BOX + 16}
                      height={ITEM_BOX + 16}
                      rx={6}
                      fill="none"
                      stroke="#b6512f"
                      strokeDasharray="7 5"
                      strokeWidth={3 / scale}
                    />
                  )}
                  <image
                    href={item.image_url}
                    x={-ITEM_BOX / 2}
                    y={-ITEM_BOX / 2}
                    width={ITEM_BOX}
                    height={ITEM_BOX}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      pointerEvents: "all",
                      filter: `drop-shadow(0 10px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 ${item.rarity === "common" ? 0 : 16}px rgba(${rarity.rgb},0.45))`,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {selectedItem && dragId === null && (
            <SelectedItemToolbar
              anchor={imagePxToContainerPoint(
                itemAnchor(selectedItem.x, selectedItem.y, selectedItem.wall_side).x,
                itemAnchor(selectedItem.x, selectedItem.y, selectedItem.wall_side).y,
              )}
              item={selectedItem}
              onFlip={() => toggleFlip(selectedItem.room_item_id)}
              onScaleDown={() => setScale(selectedItem.room_item_id, selectedItem.scale - 10)}
              onScaleUp={() => setScale(selectedItem.room_item_id, selectedItem.scale + 10)}
              onRemove={() => {
                removeItem(selectedItem.room_item_id);
                setSelectedId(null);
              }}
            />
          )}
        </div>

        <aside className="flex w-64 flex-shrink-0 flex-col overflow-y-auto rounded-[10px] border-[1.5px] border-ink bg-panel p-3 shadow-[var(--shadow-sticker)]">
          <div className="mb-2.5 flex items-center gap-1.5 border-b-[1.5px] border-dashed border-line-strong pb-2.5">
            <span className="h-1.5 w-1.5 rotate-45 bg-violet" />
            <h2 className="font-display m-0 text-[14px] font-medium italic text-ink">Collection</h2>
            <span className="ml-auto text-[11px] text-ink-faint">{inventory.length} kinds</span>
          </div>
          {inventory.length === 0 ? (
            <p className="m-0 text-[12px] text-ink-faint">
              Nothing yet — correct quiz answers have a chance to drop furniture.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {inventory.map((item) => {
                const rarity = RARITY_STYLE[item.rarity] ?? RARITY_STYLE.common;
                const isPlacing = placingItem?.id === item.id;
                const isExhausted = item.available <= 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => startPlacing(item)}
                    disabled={isExhausted}
                    className={
                      "group relative flex flex-col items-center gap-1 rounded-[8px] border-[1.5px] bg-elevated p-2 text-center transition-all disabled:cursor-not-allowed disabled:opacity-35 " +
                      (isPlacing
                        ? "border-violet shadow-[0_0_0_1px_rgba(182,81,47,0.5),0_0_16px_-2px_rgba(182,81,47,0.5)]"
                        : `${rarity.border} hover:-translate-y-0.5 ${rarity.glow}`)
                    }
                    title={isExhausted ? "All of this one are already placed" : `Place ${item.name}`}
                  >
                    <span className="pointer-events-none absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: `rgba(${rarity.rgb},1)` }} />
                    <img src={item.image_url} alt={item.name} className="h-12 w-12 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]" />
                    <span className="w-full truncate text-[10.5px] text-ink-dim">{item.name}</span>
                    <span className="rounded-[5px] border border-line-strong bg-panel px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-ink-faint">
                      {item.available}/{item.quantity}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// Lights up every valid, empty tile/slot for the zone currently being
// placed into or dragged across, and highlights whichever one the
// pointer/ghost is currently over. All coordinates are raw image pixels —
// the parent <svg>'s viewBox does the fit-to-screen work.
function GridOverlay({
  activeZone,
  lockedWallSide,
  occupied,
  target,
}: {
  activeZone: "floor" | "wall" | null;
  lockedWallSide: WallSide | null;
  occupied: Set<string>;
  target: GridTarget | null;
}) {
  const cellFill = (empty: boolean, active: boolean) =>
    active ? "rgba(182,81,47,.4)" : empty ? "rgba(62,107,92,.18)" : "rgba(169,58,44,.16)";
  const cellStroke = (empty: boolean, active: boolean) =>
    active ? "#b6512f" : empty ? "rgba(62,107,92,.75)" : "rgba(169,58,44,.65)";

  if (activeZone === "floor") {
    const cells = [];
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const empty = !occupied.has(occupiedKey(gx, gy, null));
        const active = !!target && target.wallSide === null && target.x === gx && target.y === gy;
        cells.push(
          <polygon
            key={`f:${gx}:${gy}`}
            points={floorTileCellPoints(gx, gy)}
            fill={cellFill(empty, active)}
            stroke={cellStroke(empty, active)}
            strokeWidth={1.5}
          />,
        );
      }
    }
    return <g className="pointer-events-none">{cells}</g>;
  }

  if (activeZone === "wall") {
    const sides: WallSide[] = lockedWallSide ? [lockedWallSide] : ["left", "right"];
    const cells = [];
    for (const side of sides) {
      for (let slot = 0; slot < GRID_SIZE; slot++) {
        const empty = !occupied.has(occupiedKey(slot, 0, side));
        const active = !!target && target.wallSide === side && target.x === slot;
        const anchor = wallSlotAnchorPx(side, slot);
        cells.push(
          <rect
            key={`w:${side}:${slot}`}
            x={anchor.x - WALL_SLOT_HIGHLIGHT_W / 2}
            y={anchor.y - WALL_SLOT_HIGHLIGHT_H / 2}
            width={WALL_SLOT_HIGHLIGHT_W}
            height={WALL_SLOT_HIGHLIGHT_H}
            rx={4}
            fill={cellFill(empty, active)}
            stroke={cellStroke(empty, active)}
            strokeWidth={1.5}
          />,
        );
      }
    }
    return <g className="pointer-events-none">{cells}</g>;
  }

  return null;
}

function SelectedItemToolbar({
  anchor,
  item,
  onFlip,
  onScaleDown,
  onScaleUp,
  onRemove,
}: {
  anchor: Px;
  item: RoomItemT;
  onFlip: () => void;
  onScaleDown: () => void;
  onScaleUp: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="absolute z-[10000] flex items-center gap-1 rounded-full border-[1.5px] border-ink bg-panel px-1.5 py-1 shadow-[var(--shadow-sticker-sm)]"
      style={{ left: anchor.x, top: anchor.y + 44, transform: "translate(-50%, 0)" }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={onFlip}
        title="Flip horizontally"
        className="flex items-center justify-center rounded-full p-1.5 text-ink-muted hover:bg-elevated hover:text-ink"
      >
        <FlipHorizontalIcon size={13} />
      </button>
      <button
        onClick={onScaleDown}
        title="Smaller"
        className="flex items-center justify-center rounded-full p-1.5 text-ink-muted hover:bg-elevated hover:text-ink"
      >
        <MinusIcon size={13} />
      </button>
      <span className="w-9 text-center text-[10.5px] text-ink-faint">{item.scale}%</span>
      <button
        onClick={onScaleUp}
        title="Bigger"
        className="flex items-center justify-center rounded-full p-1.5 text-ink-muted hover:bg-elevated hover:text-ink"
      >
        <PlusIcon size={13} />
      </button>
      <span className="mx-0.5 h-4 w-px bg-line" />
      <button
        onClick={onRemove}
        title="Remove"
        className="flex items-center justify-center rounded-full p-1.5 text-danger hover:bg-danger/15"
      >
        <TrashIcon size={13} />
      </button>
    </div>
  );
}

// Four L-shaped brackets at the canvas corners — the detail that reads as
// "game viewport" rather than "rounded content card".
function ViewportCorners() {
  const corner = (rotate: number) => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 14V4a2 2 0 0 1 2-2h10" stroke="#b6512f" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-2.5">
      <div className="absolute left-2.5 top-2.5">{corner(0)}</div>
      <div className="absolute right-2.5 top-2.5">{corner(90)}</div>
      <div className="absolute bottom-2.5 right-2.5">{corner(180)}</div>
      <div className="absolute bottom-2.5 left-2.5">{corner(270)}</div>
    </div>
  );
}
