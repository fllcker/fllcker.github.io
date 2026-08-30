import { Link } from 'react-router-dom';
import { contacts, featuredCount, identity, intro, projects, stack, tiers, ui } from '../content';
import { useLocale } from '../i18n';
import { Rule } from '../components/Rule';
import { Schematic } from '../components/Schematic';
import { Triad } from '../components/Triad';

export function Index() {
  const { l } = useLocale();

  return (
    <>
      {/* ---- первый экран: имя дома на полноширинной линейке ---- */}
      <section className="hero">
        <div className="sheet">
          {/* Между планкой и именем не стоит ничего: подпись над заголовком —
              это eyebrow, и контракт первого экрана говорит «больше ничего». */}
          <div className="hero__body">
            <h1 className="hero__name rise" style={{ '--i': 1 } as React.CSSProperties}>
              {identity.handle}
            </h1>
          </div>
        </div>

        <Rule draw i={2} />

        <div className="sheet">
          {/* Строка состава несёт и статус: то, что раньше стояло над именем,
              переехало сюда, под имя, где ему и место на лейбле. */}
          <div className="composition rise" style={{ '--i': 3 } as React.CSSProperties}>
            <p className="composition__set">
              {l(identity.composition).map((part, n, all) => (
                <span className="composition__item" key={part}>
                  <span className="label label--ink">{part}</span>
                  {n < all.length - 1 ? (
                    <span className="label composition__sep" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
            {/* Год связан с локацией в один токен: порознь он отрывается
                на отдельную строку и повисает сиротой при переносе. */}
            <p className="composition__set composition__status">
              <span className="label label--ink composition__item">
                {l(identity.availability)}
              </span>
              <span className="label composition__item">
                {l(identity.location)} · {identity.since}—
              </span>
            </p>
          </div>
        </div>

        <Rule draw i={4} />
      </section>

      {/* ---- индекс коллекции ---- */}
      <section className="section" id="index">
        <div className="sheet">
          <div className="section__head">
            <h2 className="section__title">{l(ui.index)}</h2>
            <span className="label">{l(ui.placeholderNotice)}</span>
          </div>
        </div>

        <Rule />

        <ul className="index__list">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link to={`/work/${project.slug}`}>
                <div className="sheet">
                  <div className="index__row">
                    <span className="label mono">{project.code}</span>
                    <span className="index__name">{project.name}</span>
                    <span className="label index__meta">{project.period}</span>
                  </div>
                </div>
              </Link>
              <Rule />
            </li>
          ))}

          {[
            { href: '#about', name: l(ui.about) },
            { href: '#stack', name: l(ui.stack) },
            { href: '#contact', name: l(ui.contact) },
          ].map((entry) => (
            <li key={entry.href}>
              <a href={entry.href}>
                <div className="sheet">
                  <div className="index__row">
                    <span aria-hidden="true" />
                    <span className="index__name">{entry.name}</span>
                    <span className="label index__meta">↓</span>
                  </div>
                </div>
              </a>
              <Rule />
            </li>
          ))}
        </ul>
      </section>

      {/* ---- о себе ---- */}
      <section className="section" id="about">
        <div className="sheet">
          <div className="section__head">
            <h2 className="section__title">{l(ui.about)}</h2>
          </div>
        </div>
        <Rule />
        <div className="sheet">
          <div className="prose" style={{ paddingBlock: '2rem' }}>
            {l(intro).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <Rule />
      </section>

      {/* ---- работы ---- */}
      <section className="section" id="work">
        <div className="sheet">
          <div className="section__head">
            <h2 className="section__title">{l(ui.work)}</h2>
            <span className="label">
              {projects.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Целиком — только последние `featuredCount` работ. Остальные уходят
            строками ниже: их глубина уже живёт на /work/<slug>, и главная не
            растёт линейно с числом проектов. */}
        {projects.slice(0, featuredCount).map((project) => {
          const schematic = project.blocks.find((block) => block.kind === 'schematic');
          return (
            <article key={project.slug}>
              <Rule />
              <div className="sheet">
                <div className="work">
                  <div>
                    <div className="work__code">
                      <span className="label mono">{project.code}</span>
                      <span className="label mono">{project.period}</span>
                    </div>

                    <Link to={`/work/${project.slug}`} className="work__link">
                      <h3 className="work__name">{project.name}</h3>
                    </Link>

                    <p className="work__summary">{l(project.summary)}</p>
                    <p className="work__lede">{l(project.lede)}</p>

                    <div className="work__foot">
                      <Link to={`/work/${project.slug}`} className="act">
                        {l(ui.readMore)} →
                      </Link>
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          className="act"
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>

                  {schematic ? (
                    <div>
                      <Schematic
                        data={schematic.schematic}
                        title={`${project.name} — ${l(schematic.heading)}`}
                      />
                      <p className="schematic__cap">{l(schematic.caption)}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <Rule />

              <div className="sheet">
                <Triad project={project} />
              </div>
            </article>
          );
        })}

        {/* Хвост коллекции: строкой индекса, а не полным разворотом. */}
        {projects.length > featuredCount ? (
          <ul className="index__list">
            {projects.slice(featuredCount).map((project) => (
              <li key={project.slug}>
                <Rule />
                <Link to={`/work/${project.slug}`}>
                  <div className="sheet">
                    <div className="index__row">
                      <span className="label mono">{project.code}</span>
                      <span className="index__name">{project.name}</span>
                      <span className="label index__meta">{project.period}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* ---- стек: ступень рисуется кеглем и подписывается словом ---- */}
      <section className="section" id="stack">
        <div className="sheet">
          <div className="section__head">
            <h2 className="section__title">{l(ui.stack)}</h2>
            <span className="label">{l(ui.stackScale)}</span>
          </div>

          {/* Легенда стоит до списка, а не в подвале: ступень без определения —
            * ещё одна непроверяемая оценка, с определением её можно спросить. */}
          <dl className="tiers">
            {tiers.map((tier) => (
              <div key={tier.id} className="tiers__item" data-tier={tier.id}>
                <dt className="label label--ink">{l(tier.name)}</dt>
                <dd className="tiers__gloss">{l(tier.gloss)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Rule />
        {/* Порядок списка задаётся ступенью, а не порядком записей в content:
          * новая технология встаёт на своё место сама. */}
        <ul className="stack__list">
          {tiers.flatMap((tier) =>
            stack
              .filter((entry) => entry.tier === tier.id)
              .map((entry) => (
                <li key={entry.name}>
                  <div className="sheet">
                    <div className="stack__row" data-tier={entry.tier}>
                      <span className="stack__name">{entry.name}</span>
                      <span className="label stack__tier">{l(tier.name)}</span>
                      <span className="label stack__note">{l(entry.note)}</span>
                    </div>
                  </div>
                  <Rule />
                </li>
              )),
          )}
        </ul>
      </section>

      {/* ---- контакты ---- */}
      <section className="section" id="contact">
        <div className="sheet">
          <div className="section__head">
            <h2 className="section__title">{l(ui.contact)}</h2>
            <span className="label">{l(identity.availability)}</span>
          </div>
        </div>
        <Rule />
        <ul>
          {contacts.map((contact) => (
            <li key={contact.href}>
              <a href={contact.href} target="_blank" rel="noreferrer noopener">
                <div className="sheet">
                  <div className="contact__row">
                    <span className="contact__value">{contact.value}</span>
                    <span className="label">{contact.label} ↗</span>
                  </div>
                </div>
              </a>
              <Rule />
            </li>
          ))}
        </ul>
      </section>

      <footer className="sheet">
        <div className="foot">
          <span className="label">
            {identity.handle} — {new Date().getFullYear()}
          </span>
          <span className="label">{l(ui.placeholderNotice)}</span>
        </div>
      </footer>
    </>
  );
}
