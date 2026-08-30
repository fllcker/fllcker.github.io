import { Link } from 'react-router-dom';
import { ui } from '../content';
import { useLocale } from '../i18n';

export function NotFound() {
  const { l } = useLocale();

  return (
    <section className="sheet">
      <div className="missing">
        <h1 className="missing__title">404</h1>
        <p className="spread__lede" style={{ marginTop: 0 }}>
          {l(ui.notFound)}
        </p>
        <p className="prose">
          <span style={{ color: 'var(--ink-dim)' }}>{l(ui.notFoundBody)}</span>
        </p>
        <Link to="/" className="act">
          ← {l(ui.backToIndex)}
        </Link>
      </div>
    </section>
  );
}
