import { ui, type Schematic as SchematicData, type SchematicNode } from '../content';
import { useLocale } from '../i18n';

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
    const x = Math.min(a.x + a.w, b.x + b.w) - 10;
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

  return (
    /* Схема не ужимается до нечитаемости: на узком экране она прокручивается
     * внутри собственного контейнера, сохраняя кегль подписей. */
    <>
    <div className="schematic-wrap">
      <svg
        className="schematic"
        viewBox={`-2 -8 ${width + 4} ${height + 16}`}
        role="img"
        aria-label={title}
      >
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
      </svg>
    </div>
      {/* Схема держит 460px, чтобы подписи не ушли в нечитаемый кегль, —
        * значит, на телефоне она уезжает под край. Подсказка появляется
        * ровно там, где это происходит, и набрана тем же моно-капсом, что
        * и остальные служебные строки: нового языка на странице не заводим. */}
      <p className="label schematic__hint" aria-hidden="true">
        {l(ui.scrollSchematic)} →
      </p>
    </>
  );
}
