import { Link } from 'react-router-dom';
import { contacts, identity, intro, languages, projects, projectTypeLabels, stack, tiers, ui } from '../content';
import { useLocale } from '../i18n';

export function Index() {
  const { l } = useLocale();
  return (
    <>
      <section className="sheet editorial-hero">
        <p className="hero__kicker">{l({ ru: 'Независимые проекты и инженерная практика', en: 'Independent projects and engineering practice' })}<br />2023—2026</p>
        <h1>{l({ ru: 'За каждым', en: 'Behind every' })}<br />{l({ ru: 'экраном — ', en: 'screen, a ' })}<em>{l({ ru: 'система.', en: 'system.' })}</em></h1>
        <div className="hero__intro">
          <p>{l({ ru: 'Я fllcker, бэкенд-инженер.', en: 'I’m fllcker, a backend engineer.' })}<br />{l({ ru: 'Создаю сервисы на Go и разбираюсь с тем,', en: 'I build services in Go and work through' })}<br className="desktop-break" />{l({ ru: ' что происходит после первого релиза.', en: ' what happens after the first release.' })}</p>
          <a className="act" href="#work">{l({ ru: 'Избранные работы', en: 'Selected work' })} ↓</a>
        </div>
      </section>
      <section className="sheet editorial-work" id="work">
        <h2 className="sr-only">{l(ui.work)}</h2>
        {projects.map(project => {
          const figures = project.blocks.find(block => block.kind === 'figures');
          const figure = figures?.items[0];
          return (
            <article className="editorial-project" key={project.slug}>
              <div className="project__number"><span>{project.code}</span><p>{project.period}</p></div>
              <div className="project__main">
                <p className="label">{l(projectTypeLabels[project.type])}</p>
                <h3><Link to={`/work/${project.slug}`}>{project.name}<span className="project__arrow" aria-hidden="true">↗</span></Link></h3>
                <p className="project__description">{l(project.lede)}</p>
                <ul className="tags" aria-label={l(ui.stack)}>{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>
                <div className="project__links"><Link className="act" to={`/work/${project.slug}`}>{l(ui.readMore)} ↗</Link>{project.links.map(link => <a className="act" key={link.href} href={link.href} target="_blank" rel="noreferrer noopener">{link.label} ↗</a>)}</div>
              </div>
              <div className="project__margin">{figure ? <><strong>{figure.value}</strong><span>{l(figure.label)}</span></> : <><span className="project__role-label">{l(ui.role)}</span><p>{l(project.role)}</p></>}</div>
            </article>
          );
        })}
      </section>
      <section className="sheet editorial-section" id="about">
        <div className="section__side"><span className="label">01 / {l(ui.about)}</span><p>{l(identity.location)}<br />{l(identity.availability)}</p></div>
        <div className="about__body"><h2>{l({ ru: 'От идеи до продакшена.', en: 'From idea to production.' })}</h2><div className="prose">{l(intro).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><dl className="languages">{languages.map(language => <div key={language.name.en}><dt>{l(language.name)}</dt><dd><span>{l(language.level)}</span>{language.gloss ? <p>{l(language.gloss)}</p> : null}</dd></div>)}</dl></div>
      </section>
      <section className="sheet editorial-section" id="stack">
        <div className="section__side"><span className="label">02 / {l(ui.stack)}</span><p>{l(ui.stackScale)}</p></div>
        <div><h2>{l({ ru: 'Инструменты и практика.', en: 'Tools and practice.' })}</h2><div className="stack-groups">{tiers.map(tier => <section key={tier.id} className="stack-group"><h3>{l(tier.name)}</h3><p>{l(tier.gloss)}</p><ul>{stack.filter(entry => entry.tier === tier.id).map(entry => <li key={entry.name}><strong>{entry.name}</strong><span>{l(entry.note)}</span></li>)}</ul></section>)}</div></div>
      </section>
      <section className="sheet editorial-contact" id="contact"><div><span className="label">03 / {l(ui.contact)}</span><h2>{l({ ru: 'Давайте построим', en: 'Let’s build' })}<br /><em>{l({ ru: 'что-нибудь сложное.', en: 'something complex.' })}</em></h2><div className="contact__links">{contacts.map(contact => <a className={contact.primary ? 'contact__primary' : 'act'} key={contact.label} href={contact.href}>{contact.value} ↗</a>)}</div></div><p>{l(identity.composition).join(' · ')}<br />{l(identity.availability)}</p></section>
      <footer className="sheet"><div className="foot"><span className="label">{identity.handle} © {new Date().getFullYear()}</span><a href="#" className="act">{l({ ru: 'Наверх', en: 'Back to top' })} ↑</a></div></footer>
    </>
  );
}
