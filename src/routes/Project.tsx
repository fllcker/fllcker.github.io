import { Link, Navigate, useParams } from 'react-router-dom';
import { type Block, projects, ui } from '../content';
import { useLocale } from '../i18n';
import { Rule } from '../components/Rule';
import { Schematic } from '../components/Schematic';
import { Triad } from '../components/Triad';

/** Разворот одного лука: работа целиком, блок за блоком. */
export function Project() {
  const { slug } = useParams();
  const { l } = useLocale();

  const position = projects.findIndex((item) => item.slug === slug);
  if (position === -1) return <Navigate to="/404" replace />;

  const project = projects[position];
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <section className="sheet">
        <div className="spread__head">
          <div className="work__code">
            <Link to="/#index" className="act">
              ← {l(ui.backToIndex)}
            </Link>
          </div>
          <div className="work__code" style={{ paddingTop: '2rem' }}>
            <span className="label mono">{project.code}</span>
            <span className="label mono">{project.period}</span>
          </div>
          <h1 className="spread__name">{project.name}</h1>
          <p className="spread__lede">{l(project.lede)}</p>
        </div>
      </section>

      <Rule />
      <div className="sheet">
        <Triad project={project} />
      </div>
      <Rule />

      {project.blocks.map((block, n) => (
        <section key={`${block.kind}-${n}`}>
          <div className="sheet">
            <div className="block">
              {/* Оговорка живёт в колонке заголовка, а не над числами: белый
                  моно-капслок вплотную над крупным элементом — тот же силуэт
                  eyebrow, который запрещён на первом экране. */}
              <div className="block__side">
                <h2 className="block__heading">{l(block.heading)}</h2>
                {block.kind === 'figures' ? (
                  <p className="block__note label label--ink">{l(ui.placeholderFigures)}</p>
                ) : null}
              </div>
              <div>
                <BlockBody block={block} projectName={project.name} />
              </div>
            </div>
          </div>
          <Rule />
        </section>
      ))}

      <section className="sheet">
        <Link to={`/work/${next.slug}`}>
          <div className="spread__next">
            <span className="label">{l(ui.nextWork)}</span>
            <span className="spread__next-name">{next.name}</span>
          </div>
        </Link>
      </section>

      <Rule />

      <footer className="sheet">
        <div className="foot">
          <Link to="/#contact" className="act">
            {l(ui.contact)} →
          </Link>
          <span className="label">{l(ui.placeholderNotice)}</span>
        </div>
      </footer>
    </>
  );
}

function BlockBody({ block, projectName }: { block: Block; projectName: string }) {
  const { l } = useLocale();

  switch (block.kind) {
    case 'prose':
      return (
        <div className="prose">
          {l(block.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );

    case 'points':
      return (
        <ul>
          {block.items.map((item, n) => (
            <li key={l(item.term)}>
              {n > 0 ? <Rule /> : null}
              <div className="points__item">
                <h3 className="points__term">{l(item.term)}</h3>
                <p className="points__body">{l(item.body)}</p>
              </div>
            </li>
          ))}
        </ul>
      );

    case 'figures':
      /* Крупное число над мелкой подписью в ряд — шаблонный блок метрик,
       * чужой для этой страницы. Линованная строка «значение — подпись» уже
       * работает в стеке и контактах, поэтому цифры идут ею же. */
      return (
        <div>
          <ul>
            {block.items.map((item) => (
              <li key={item.value + l(item.label)}>
                <Rule />
                <div className="figures__row">
                  <span className="figures__value">{item.value}</span>
                  <span className="label figures__label">{l(item.label)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'schematic':
      return (
        <div>
          <Schematic
            data={block.schematic}
            title={`${projectName} — ${l(block.heading)}`}
          />
          <p className="schematic__cap">{l(block.caption)}</p>
        </div>
      );
  }
}
