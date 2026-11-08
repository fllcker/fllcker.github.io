import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { type Schematic as SchematicData, type SchematicNode } from '../content';
import { useLocale } from '../i18n';
import { gesture, INITIAL_VIEW, MAX_SCALE, MIN_SCALE, transformView, type Point, type Viewport } from './schematicViewport';

/* Сетка схемы в единицах viewBox. Схема рисуется той же волосяной
 * графикой, что и вся страница: 1px, без заливок, без скруглений. */
const U = 40; // ширина колонки
const V = 32; // высота строки
const BOX_H = 26;
const GAP = 10; // зазор между соседними узлами по горизонтали

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };
type Anchor = 'start' | 'middle';

/* Ширина знака моноширинного Geist: кегль × 0.6 плюс трекинг.
 * Нужна, чтобы рамка росла под подпись, а не обрезала её. */
const LABEL_CH = 7.5 * 0.6 + 7.5 * 0.05;
const NOTE_CH = 6.5 * 0.6 + 6.5 * 0.03;
const PAD = 7;

function box(node: SchematicNode): Box {
  // Рамка не уже своей подписи: содержание схемы будет дописываться,
  // и длинное имя узла обязано раздвинуть рамку, а не вылезти за неё.
  const textW = Math.max(
    node.label.length * LABEL_CH,
    (node.note?.length ?? 0) * NOTE_CH,
  );
  const w = Math.max((node.w ?? 2) * U - GAP, textW + PAD * 2);
  const x = node.x * U;
  const y = node.y * V;
  return { x, y, w, h: BOX_H, cx: x + w / 2, cy: y + BOX_H / 2 };
}

/**
 * Ортогональный маршрут между узлами: прямая, вертикаль или колено.
 * Подпись всегда садится на самый длинный собственный отрезок маршрута —
 * у прямой это её середина, у колена и вертикали — вертикальный участок.
 * Иначе две связи, выходящие из одного узла, кладут подписи в одну точку.
 */
function route(a: Box, b: Box): { d: string; lx: number; ly: number; anchor: Anchor } {
  const sameRow = Math.abs(a.cy - b.cy) < 1;
  const columnsOverlap = a.x < b.x + b.w && b.x < a.x + a.w;

  if (sameRow) {
    const forward = b.cx > a.cx;
    const sx = forward ? a.x + a.w : a.x;
    const ex = forward ? b.x : b.x + b.w;
    return { d: `M${sx},${a.cy} H${ex}`, lx: (sx + ex) / 2, ly: a.cy - 6, anchor: 'middle' };
  }

  if (columnsOverlap) {
    const down = b.cy > a.cy;
    // Вертикаль идёт по середине общей колонки, а не у её края. Под рядом
    // одинаковых рамок, включённых в одну полосу, линии обязаны стоять по
    // центрам рамок: край читается как промах, а не как решение. У вложенных
    // рамок середина общей колонки — это и есть центр узкой из двух.
    const x = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2;
    const sy = down ? a.y + a.h : a.y;
    const ey = down ? b.y : b.y + b.h;
    return { d: `M${x},${sy} V${ey}`, lx: x + 5, ly: (sy + ey) / 2 + 2, anchor: 'start' };
  }

  // Колено: выходим вбок, идём по вертикали на полпути, входим сбоку.
  const forward = b.cx > a.cx;
  const sx = forward ? a.x + a.w : a.x;
  const ex = forward ? b.x : b.x + b.w;
  const mx = (sx + ex) / 2;
  return {
    d: `M${sx},${a.cy} H${mx} V${b.cy} H${ex}`,
    lx: mx + 5,
    ly: (a.cy + b.cy) / 2 + 2,
    anchor: 'start',
  };
}

export function Schematic({ data, title }: { data: SchematicData; title: string }) {
  const { l } = useLocale();
  const boxes = new Map(data.nodes.map((node) => [node.id, box(node)]));
  // Кадр считается по фактическим габаритам, а не по объявленной сетке:
  // рамка, выросшая под длинную подпись, обязана попасть в кадр целиком.
  const placed = [...boxes.values()];
  const width = Math.max(data.cols * U, ...placed.map((b) => b.x + b.w));
  const height = Math.max(data.rows * V, ...placed.map((b) => b.y + b.h));
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<Viewport>(INITIAL_VIEW);
  const pointers = useRef(new Map<number, Point>());
  const [view, setView] = useState(INITIAL_VIEW);
  const [dragging, setDragging] = useState(false);

  function update(next: Viewport) {
    viewRef.current = next;
    setView(next);
  }

  function localPoint(clientX: number, clientY: number): Point | null {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    return new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  }

  function zoom(factor: number) {
    const center = { x: width / 2, y: height / 2 };
    update(transformView(viewRef.current, center, center, factor));
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Native listener: React's passive wheel listener cannot stop page scrolling.
    function wheel(event: WheelEvent) {
      const anchor = localPoint(event.clientX, event.clientY);
      if (!anchor) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? svg!.clientHeight : 1);
      const factor = Math.exp(-Math.max(-100, Math.min(100, delta)) * 0.008);
      update(transformView(viewRef.current, anchor, anchor, factor));
    }
    svg.addEventListener('wheel', wheel, { passive: false });
    return () => svg.removeEventListener('wheel', wheel);
  }, []);

  function pointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = localPoint(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, point);
    setDragging(true);
  }

  function pointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    const point = localPoint(event.clientX, event.clientY);
    if (!point) return;
    const before = gesture([...pointers.current.values()]);
    pointers.current.set(event.pointerId, point);
    const after = gesture([...pointers.current.values()]);
    update(transformView(viewRef.current, before.center, after.center,
      before.distance > 0 ? after.distance / before.distance : 1));
  }

  function pointerEnd(event: ReactPointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId);
    setDragging(pointers.current.size > 0);
  }

  const hint = l({
    ru: 'Колёсико — масштаб · Перетаскивание — перемещение · На телефоне — жесты',
    en: 'Scroll to zoom · Drag to pan · Touch gestures on mobile',
  });

  return (
    <>
    <div className={`schematic-wrap${dragging ? ' schematic-wrap--dragging' : ''}`}>
      <svg
        ref={svgRef}
        className="schematic"
        // Breathing room belongs to the canvas coordinates, not a clipped inset.
        viewBox={`-16 -20 ${width + 32} ${height + 80}`}
        style={{ aspectRatio: `${width + 32} / ${height + 80}` }}
        role="img"
        aria-label={`${title}. ${hint}`}
        tabIndex={0}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={pointerEnd}
        onKeyDown={(event) => {
          const step = 24 / (svgRef.current?.getScreenCTM()?.a || 1);
          if (event.key === '+' || event.key === '=') zoom(1.25);
          else if (event.key === '-') zoom(0.8);
          else if (event.key === '0' || event.key === 'Home') update(INITIAL_VIEW);
          else if (event.key.startsWith('Arrow')) {
            const { x, y, scale } = viewRef.current;
            update({ scale, x: x + (event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0),
              y: y + (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0) });
          } else return;
          event.preventDefault();
        }}
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
        {data.edges.map((edge) => {
          const a = boxes.get(edge.from);
          const b = boxes.get(edge.to);
          if (!a || !b) return null;
          const { d, lx, ly, anchor } = route(a, b);
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                className={
                  edge.async ? 'schematic__edge schematic__edge--async' : 'schematic__edge'
                }
                d={d}
              />
              {edge.label ? (
                <text className="schematic__edge-label" x={lx} y={ly} textAnchor={anchor}>
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {data.nodes.map((node) => {
          const b = boxes.get(node.id)!;
          return (
            <g key={node.id}>
              <rect
                className={
                  node.emphasis ? 'schematic__box schematic__box--emphasis' : 'schematic__box'
                }
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
              />
              <text className="schematic__label" x={b.x + 7} y={b.y + 11}>
                {node.label}
              </text>
              {node.note ? (
                <text className="schematic__note" x={b.x + 7} y={b.y + 20}>
                  {node.note}
                </text>
              ) : null}
            </g>
          );
        })}
        </g>
      </svg>
      <div className="schematic__footer">
      <p className="schematic__hint">{hint}</p>
      <div className="schematic__controls" role="group" aria-label={l({ ru: 'Масштаб схемы', en: 'Diagram zoom' })}>
        <button type="button" onClick={() => zoom(0.8)} disabled={view.scale <= MIN_SCALE} aria-label={l({ ru: 'Отдалить', en: 'Zoom out' })} title={l({ ru: 'Отдалить', en: 'Zoom out' })}>−</button>
        <button type="button" className="schematic__reset" onClick={() => update(INITIAL_VIEW)} aria-label={l({ ru: 'Сбросить масштаб и положение', en: 'Reset zoom and position' })} title={l({ ru: 'Сбросить масштаб и положение', en: 'Reset zoom and position' })}>{Math.round(view.scale * 100)}%</button>
        <button type="button" onClick={() => zoom(1.25)} disabled={view.scale >= MAX_SCALE} aria-label={l({ ru: 'Приблизить', en: 'Zoom in' })} title={l({ ru: 'Приблизить', en: 'Zoom in' })}>+</button>
      </div>
      </div>
    </div>
    </>
  );
}
