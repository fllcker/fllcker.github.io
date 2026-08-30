import { useEffect } from 'react';

/**
 * Волосяная линейка — единственное средство деления на этой странице.
 * Свет по ней ведёт хук `usePointerRules`, живущий в макете.
 */
export function Rule({ draw, i }: { draw?: boolean; i?: number }) {
  return (
    <div
      className={draw ? 'rule draw' : 'rule'}
      style={i === undefined ? undefined : ({ '--i': i } as React.CSSProperties)}
    />
  );
}

const REACH = 260; // px: на такой вертикальной дистанции свет затухает в ноль

/**
 * Ведёт свет по линейкам за курсором. Один слушатель на страницу,
 * дросселированный до кадра; выключается там, где указателя нет
 * или где движение попросили убрать.
 */
export function usePointerRules(deps: unknown) {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const rules = document.querySelectorAll<HTMLElement>('.rule');
      for (const rule of rules) {
        const rect = rule.getBoundingClientRect();
        const distance = Math.abs(rect.top - y);
        const glow = distance >= REACH ? 0 : 1 - distance / REACH;
        // --mx локальна для каждой линейки: полноширинные и внутренние
        // линейки светятся одинаково правильно.
        rule.style.setProperty('--mx', `${x - rect.left}px`);
        rule.style.setProperty('--g', glow.toFixed(3));
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [deps]);
}
