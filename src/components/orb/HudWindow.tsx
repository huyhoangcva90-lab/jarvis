import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
} from "react";

export type HudWindowPosition = { x: number; y: number };

type HudWindowProps = {
  active?: boolean;
  ariaLabel: string;
  children: ReactNode;
  className: string;
  minimized?: boolean;
  position: HudWindowPosition;
  titleBar: ReactNode;
  titleBarClassName: string;
  onActivate: () => void;
  onPositionChange: (position: HudWindowPosition) => void;
};

type DragState = {
  active: boolean;
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  nextX: number;
  nextY: number;
};

const INITIAL_DRAG: DragState = {
  active: false,
  pointerId: -1,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  nextX: 0,
  nextY: 0,
};

function clamp(value: number, min: number, max: number) {
  if (min > max) return min;
  return Math.min(max, Math.max(min, value));
}

export default function HudWindow({
  active = false,
  ariaLabel,
  children,
  className,
  minimized = false,
  position,
  titleBar,
  titleBarClassName,
  onActivate,
  onPositionChange,
}: HudWindowProps) {
  const windowRef = useRef<HTMLElement>(null);
  const drag = useRef<DragState>({ ...INITIAL_DRAG });

  const applyPosition = (x: number, y: number) => {
    if (windowRef.current) {
      windowRef.current.style.setProperty("--window-x", `${x}px`);
      windowRef.current.style.setProperty("--window-y", `${y}px`);
    }
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, input, label, a")) return;
    const panel = windowRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const margin = 8;
    drag.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      minX: position.x + margin - rect.left,
      maxX: position.x + window.innerWidth - margin - rect.right,
      minY: position.y + margin - rect.top,
      maxY: position.y + window.innerHeight - margin - rect.bottom,
      nextX: position.x,
      nextY: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    panel.classList.add("is-dragging");
    onActivate();
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current.active || current.pointerId !== event.pointerId) return;
    const nextX = clamp(current.originX + event.clientX - current.startX, current.minX, current.maxX);
    const nextY = clamp(current.originY + event.clientY - current.startY, current.minY, current.maxY);
    current.nextX = Math.round(nextX);
    current.nextY = Math.round(nextY);
    applyPosition(current.nextX, current.nextY);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current.active || current.pointerId !== event.pointerId) return;
    drag.current.active = false;
    windowRef.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onPositionChange({ x: current.nextX, y: current.nextY });
  };

  const moveWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.altKey) return;
    const delta = event.shiftKey ? 32 : 12;
    const next = { ...position };
    if (event.key === "ArrowLeft") next.x -= delta;
    else if (event.key === "ArrowRight") next.x += delta;
    else if (event.key === "ArrowUp") next.y -= delta;
    else if (event.key === "ArrowDown") next.y += delta;
    else return;
    event.preventDefault();
    onPositionChange(next);
  };

  const style = {
    "--window-x": `${position.x}px`,
    "--window-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <aside
      ref={windowRef}
      className={`hud-window ${className}${minimized ? " is-minimized" : ""}${active ? " is-active" : ""}`}
      aria-label={ariaLabel}
      style={style}
      onPointerDownCapture={onActivate}
    >
      <div
        className={`hud-window-handle ${titleBarClassName}`}
        role="toolbar"
        aria-label={`Di chuyển ${ariaLabel}`}
        tabIndex={0}
        onKeyDown={moveWithKeyboard}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {titleBar}
      </div>
      {children}
    </aside>
  );
}
