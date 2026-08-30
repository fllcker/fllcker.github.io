import { Link, useLocation } from 'react-router-dom';
import { identity, ui } from '../content';
import { useLocale } from '../i18n';
import { Rule } from './Rule';

/**
 * Верхняя планка: марка слева, язык и действие справа.
 * Первичное действие видно с первого пикселя на любом маршруте.
 */
export function Bar() {
  const { locale, setLocale, l } = useLocale();
  const { pathname } = useLocation();
  const onIndex = pathname === '/';

  return (
    <header className="bar">
      <div className="bar__inner">
        <Link to="/" className="bar__mark" aria-label={identity.handle}>
          {identity.handle}
        </Link>

        <div className="bar__spacer" />

        <nav className="bar__nav">
          <div className="lang">
            <span className="sr-only">{locale === 'ru' ? 'Язык сайта' : 'Site language'}</span>
            <button
              type="button"
              className="lang__opt"
              aria-pressed={locale === 'ru'}
              onClick={() => setLocale('ru')}
            >
              ru
            </button>
            <span className="lang__sep" aria-hidden="true">
              {'/'}
            </span>
            <button
              type="button"
              className="lang__opt"
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              en
            </button>
          </div>

          {onIndex ? (
            <a className="act" href="#contact">
              {l(ui.contact)}
            </a>
          ) : (
            <Link className="act" to="/#contact">
              {l(ui.contact)}
            </Link>
          )}
        </nav>
      </div>
      <Rule />
    </header>
  );
}
