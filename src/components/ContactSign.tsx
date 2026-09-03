import { useLayoutEffect, useRef } from 'react';
import { contacts } from '../content';

/* ============================================================================
 *  Подпись — закрывающий жест страницы.
 *
 *  Имя открывает лист во всю ширину; адрес его во всю ширину закрывает. Один
 *  и тот же приём в начале и в конце: страница читается как разворот, а не
 *  как лента секций, и целевое действие получает тот же кегль, что имя.
 *
 *  Кегль не выведен из ширины экрана, он измерен. `31vw` под именем работает
 *  потому, что «fllcker» — семь букв и меняться не собирается; адрес меняться
 *  собирается, поэтому формула от vw сломалась бы на первой же правке почты.
 *  Здесь снимается мерка со строки и пересчитывается пропорцией — адрес любой
 *  длины садится ровно по ширине листа, а смена почты в content.ts остаётся
 *  правкой данных, а не вёрстки.
 * ========================================================================= */

/** Кегль, на котором снимается мерка: крупный, чтобы округление не мешало. */
const PROBE = 100;
/** Ниже адрес перестаёт читаться — дальше жест уступает и строка переносится. */
const MIN = 15;
/** Выше короткий адрес распирает лист и спорит с именем в первом экране. */
const MAX = 256;

/**
 * Сажает строку по ширине контейнера.
 *
 * Мерка снимается на живом узле, а не в canvas: трекинг, кернинг и подмена
 * шрифта входят в измерение сами, тогда как `measureText` про них не знает.
 * Оба присвоения кегля идут внутри одного кадра, поэтому промежуточная
 * стопиксельная строка не доживает до отрисовки.
 */
function useFitToWidth(text: string) {
  const box = useRef<HTMLAnchorElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const boxEl = box.current;
    const lineEl = line.current;
    if (!boxEl || !lineEl) return;

    let frame = 0;

    const fit = () => {
      frame = 0;
      const room = boxEl.clientWidth;
      if (!room) return;

      lineEl.style.whiteSpace = 'nowrap';
      // `max-width: 100%` из таблицы стилей обязан на время мерки уйти: иначе
      // на узком экране ширина упирается в контейнер, отношение выходит
      // единицей, и строка навсегда остаётся в пробном кегле.
      lineEl.style.maxWidth = 'none';
      lineEl.style.fontSize = `${PROBE}px`;
      const width = lineEl.getBoundingClientRect().width;
      lineEl.style.maxWidth = '';
      if (!width) return;

      const ideal = (PROBE * room) / width;
      lineEl.style.fontSize = `${Math.min(MAX, Math.max(MIN, ideal))}px`;
      // Адрес, который не встаёт в строку даже на нижнем кегле, переносится:
      // читаемость дороже жеста, а обрезанная почта не работает вовсе.
      lineEl.style.whiteSpace = ideal < MIN ? 'normal' : 'nowrap';
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };

    fit();

    const observer = new ResizeObserver(schedule);
    observer.observe(boxEl);
    // Шрифт приезжает позже разметки: до него мерка снята с запасного
    // начертания и промахивается на несколько процентов.
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [text]);

  return { box, line };
}

export function ContactSign() {
  // Главный канал помечен в данных, а не выбран по индексу: порядок в
  // content.ts свободен, а добавленный контакт сам встаёт в нижнюю строку.
  const primary = contacts.find((contact) => contact.primary) ?? contacts[0];
  const rest = contacts.filter((contact) => contact !== primary);
  const { box, line } = useFitToWidth(primary.value);

  return (
    <>
      <div className="sheet">
        <a
          className="sign"
          ref={box}
          href={primary.href}
          aria-label={`${primary.label}: ${primary.value}`}
        >
          <span className="sign__value" ref={line}>
            {primary.value}
          </span>
        </a>
      </div>

      <div className="rule" />

      <div className="sheet">
        <p className="sign__rest">
          {rest.map((contact, n) => (
            <span className="sign__item" key={contact.href}>
              <a href={contact.href} target="_blank" rel="noreferrer noopener">
                <span className="label label--ink">{contact.label}</span>{' '}
                <span className="label sign__handle">{contact.value} ↗</span>
              </a>
              {/* Разделитель уезжает вместе со своим словом — как в строке
                  состава под именем, чтобы перенос не начинался со слэша. */}
              {n < rest.length - 1 ? (
                <span className="label sign__sep" aria-hidden="true">
                  /
                </span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
