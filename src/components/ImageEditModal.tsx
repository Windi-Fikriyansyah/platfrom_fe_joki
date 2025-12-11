import React, { useEffect, useMemo, useRef, useState } from "react";

export type ImageTransform = {
  scale: number;
  pos: { x: number; y: number };
  flipH: boolean;
  flipV: boolean;
};

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  pos: { x: 0, y: 0 },
  flipH: false,
  flipV: false,
};

export default function ImageEditModal({
  src,
  open,
  onClose,
  onSave,
  initialTransform,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
  onSave: (data: ImageTransform) => void;
  initialTransform?: ImageTransform;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const init = useMemo(
    () => initialTransform ?? DEFAULT_TRANSFORM,
    [initialTransform]
  );

  const [scale, setScale] = useState(init.scale);
  const [pos, setPos] = useState(init.pos);
  const [flipH, setFlipH] = useState(init.flipH);
  const [flipV, setFlipV] = useState(init.flipV);

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    pointerId: -1,
  });

  useEffect(() => {
    if (!open) return;
    setScale(init.scale);
    setPos(init.pos);
    setFlipH(init.flipH);
    setFlipV(init.flipV);
  }, [open, src, init.scale, init.pos, init.flipH, init.flipV]);

  // lock scroll background
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function clampPos(next: { x: number; y: number }, sc: number) {
    const el = wrapRef.current;
    if (!el) return next;
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const maxX = Math.max(0, ((sc - 1) * w) / 2);
    const maxY = Math.max(0, ((sc - 1) * h) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  useEffect(() => {
    if (!open) return;
    setPos((p) => clampPos(p, scale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, open]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!wrapRef.current) return;
    dragRef.current.dragging = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.baseX = pos.x;
    dragRef.current.baseY = pos.y;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const next = {
      x: dragRef.current.baseX + dx,
      y: dragRef.current.baseY + dy,
    };
    setPos(clampPos(next, scale));
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(
        dragRef.current.pointerId
      );
    } catch {}
  }

  function handleReset() {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setFlipH(false);
    setFlipV(false);
  }

  function handleSave() {
    onSave({
      scale,
      pos: clampPos(pos, scale),
      flipH,
      flipV,
    });
    onClose();
  }

  if (!open) return null;

  const imgStyle: React.CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) scaleX(${
      flipH ? -1 : 1
    }) scaleY(${flipV ? -1 : 1})`,
    transformOrigin: "center",
    willChange: "transform",
    transition: dragRef.current.dragging ? "none" : "transform 120ms ease-out",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // klik backdrop untuk tutup
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="h-full w-full p-4 flex items-center justify-center">
        {/* CARD */}
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="shrink-0 px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Edit Cover (16:10)</h2>
              <p className="text-xs text-gray-500">
                Drag untuk geser, zoom untuk crop
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-lg border hover:bg-gray-50 grid place-items-center"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {/* BODY (SCROLLABLE) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">
            {/* PREVIEW */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Preview
              </div>

              <div
                ref={wrapRef}
                className="relative w-full overflow-hidden rounded-xl bg-black/5 border-2 border-dashed border-blue-300"
                style={{
                  aspectRatio: "16/10",
                  cursor: dragRef.current.dragging ? "grabbing" : "grab",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
              >
                {src ? (
                  <img
                    src={src}
                    alt="cover"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover select-none"
                    style={imgStyle}
                  />
                ) : null}

                <div className="absolute bottom-2 left-2 text-[11px] font-semibold text-blue-700 bg-white/90 px-2 py-1 rounded">
                  16:10 • drag & zoom
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Kalau belum bisa geser, **zoom dulu** (scale &gt; 1) baru drag.
              </p>
            </div>

            {/* ZOOM */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-700">Zoom</div>
                <div className="text-xs font-semibold text-gray-600">
                  {Math.round(scale * 100)}%
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                onClick={() =>
                  setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))
                }
              >
                🔍+ Zoom In
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                onClick={() =>
                  setScale((s) => Math.max(1, +(s - 0.2).toFixed(2)))
                }
              >
                🔍- Zoom Out
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                onClick={() => setFlipH((v) => !v)}
              >
                ↔️ Flip H
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                onClick={() => setFlipV((v) => !v)}
              >
                ↕️ Flip V
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                onClick={handleReset}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* FOOTER (STICKY INSIDE CARD) */}
          <div className="shrink-0 px-6 py-4 border-t bg-white flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              onClick={handleSave}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
