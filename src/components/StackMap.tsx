import { useEffect, useMemo, useState } from 'react';
import { stack, tiers, ui, type StackEntry } from '../content';
import { useLocale } from '../i18n';

/* ============================================================================
 *  Карта стека — «treemap» (в WinDirStat это же самое зовут картой диска).
 *
 *  Список отвечал на вопрос «что я знаю», карта отвечает на «сколько чего»:
 *  площадь клетки задана ступенью, поэтому ядро занимает лист, а прикладное
 *  жмётся в угол — соотношение видно раньше, чем прочитана первая подпись.
 *  Цвета нет: ступень читается площадью, кеглем и яркостью заливки, то есть
 *  ровно теми же средствами, что и вся остальная страница.
 * ========================================================================= */

type Rect = { x: number; y: number; w: number; h: number };
type Cell = Rect & { entry: StackEntry };

/** Пропорции листа карты. Первое совпадение сверху вниз, иначе — узкий вариант. */
const SHAPES = [
  { at: '(min-width: 1100px)', aspect: 2.45 },
  { at: '(min-width: 760px)', aspect: 1.7 },
];
const NARROW_ASPECT = 0.82;

/**
 * Насколько клетка далека от квадрата: чем ближе к 1, тем лучше.
 * Ряд, который портит пропорции, закрывается — на этом и стоит алгоритм.
 */
function worst(row: number[], side: number): number {
  let sum = 0;
  let max = -Infinity;
  let min = Infinity;
  for (const v of row) {
    sum += v;
    if (v > max) max = v;
    if (v < min) min = v;
  }
  const s2 = sum * sum;
  const l2 = side * side;
  return Math.max((l2 * max) / s2, s2 / (l2 * min));
}

/**
 * Squarified treemap (Bruls, Huizing, van Wijk, 2000).
 * На вход — веса, на выходе — доли единичного прямоугольника: 0..1 по обеим
 * осям, чтобы вёрстка была в процентах и не зависела от пикселей.
 */
function squarify(items: { value: number; entry: StackEntry }[], aspect: number): Cell[] {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return [];

  // Работаем в прямоугольнике aspect × 1, потом сжимаем X обратно в 0..1.
  const scale = aspect / total;
  const values = sorted.map((item) => item.value * scale);

  const out: Cell[] = [];
  let rect: Rect = { x: 0, y: 0, w: aspect, h: 1 };
  let i = 0;

  while (i < values.length) {
    const side = Math.min(rect.w, rect.h);

    // Набираем ряд, пока он не начал ухудшать пропорции.
    let end = i + 1;
    let row = values.slice(i, end);
    while (end < values.length) {
      const next = values.slice(i, end + 1);
      if (worst(next, side) > worst(row, side)) break;
      row = next;
      end += 1;
    }

    const rowSum = row.reduce((sum, v) => sum + v, 0);

    if (rect.w >= rect.h) {
      // Ряд встаёт колонкой у левого края и отрезает от остатка полосу.
      const w = rowSum / rect.h;
      let y = rect.y;
      row.forEach((v, n) => {
        const h = v / w;
        out.push({ entry: sorted[i + n].entry, x: rect.x, y, w, h });
        y += h;
      });
      rect = { x: rect.x + w, y: rect.y, w: rect.w - w, h: rect.h };
    } else {
      // Остаток вытянут по вертикали — ряд ложится строкой сверху.
      const h = rowSum / rect.w;
      let x = rect.x;
      row.forEach((v, n) => {
        const w = v / h;
        out.push({ entry: sorted[i + n].entry, x, y: rect.y, w, h });
        x += w;
      });
      rect = { x: rect.x, y: rect.y + h, w: rect.w, h: rect.h - h };
    }

    i = end;
  }

  return out.map((cell) => ({ ...cell, x: cell.x / aspect, w: cell.w / aspect }));
}

function pickAspect(): number {
  if (typeof window === 'undefined') return SHAPES[0].aspect;
  const hit = SHAPES.find((shape) => window.matchMedia(shape.at).matches);
  return hit ? hit.aspect : NARROW_ASPECT;
}

/** Форма листа зависит от ширины экрана: раскладку надо пересчитывать. */
function useAspect(): number {
  const [aspect, setAspect] = useState(pickAspect);

  useEffect(() => {
    const queries = SHAPES.map((shape) => window.matchMedia(shape.at));
    const sync = () => setAspect(pickAspect());
    queries.forEach((query) => query.addEventListener('change', sync));
    sync();
    return () => queries.forEach((query) => query.removeEventListener('change', sync));
  }, []);

  return aspect;
}

export function StackMap() {
  const { l } = useLocale();
  const aspect = useAspect();

  const cells = useMemo(() => {
    const weightOf = new Map(tiers.map((tier) => [tier.id, tier.weight]));
    return squarify(
      stack.map((entry) => ({ value: weightOf.get(entry.tier) ?? 1, entry })),
      aspect,
    );
  }, [aspect]);

  const tierOf = useMemo(() => new Map(tiers.map((tier) => [tier.id, tier])), []);

  return (
    <figure className="stack-map__frame">
      <ul className="stack-map" style={{ aspectRatio: `${aspect}` }}>
        {cells.map((cell) => {
          const tier = tierOf.get(cell.entry.tier);
          // Подписи уходят по одной, а не разом: сначала примечание, ступень
          // держится до последнего. Один порог на обе строки означал бы, что
          // прикладное — 3.5% листа, то есть всегда ниже любого разумного
          // порога, — остаётся голым именем и теряет как раз то слово, ради
          // которого карта и нарисована.
          const area = cell.w * cell.h;
          const showsTier = area >= 0.02 && cell.h >= 0.12 && cell.w >= 0.07;
          const showsNote = area >= 0.05 && cell.h >= 0.16 && cell.w >= 0.1;
          return (
            <li
              key={cell.entry.name}
              className="stack-map__cell"
              data-tier={cell.entry.tier}
              // В тесной клетке ступень остаётся единственной подписью, и CSS
              // ужимает ей трекинг, чтобы слово встало целиком.
              data-tight={showsTier && !showsNote ? '' : undefined}
              style={{
                left: `${cell.x * 100}%`,
                top: `${cell.y * 100}%`,
                width: `${cell.w * 100}%`,
                height: `${cell.h * 100}%`,
                // Обратная длина имени: CSS умножает её на ширину клетки и
                // получает кегль, при котором «Elasticsearch» ещё помещается
                // в свою узкую клетку. Делить в calc() на var() ненадёжно.
                ['--fit']: (1 / cell.entry.name.length).toFixed(4),
              } as React.CSSProperties}
            >
              <span className="stack-map__name">{cell.entry.name}</span>
              <span className={showsTier ? 'stack-map__meta' : 'sr-only'}>
                <span className="label stack-map__tier">{tier ? l(tier.name) : ''}</span>
                <span className={showsNote ? 'label stack-map__note' : 'sr-only'}>
                  {l(cell.entry.note)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="stack-map__cap label">{l(ui.stackArea)}</figcaption>
    </figure>
  );
}
