import { type Project, ui } from '../content';
import { useLocale } from '../i18n';

/**
 * Триада метаданных: роль / стек / период.
 * Один порядок, одно место, под каждой работой — глаз учит её один раз.
 */
export function Triad({ project }: { project: Project }) {
  const { l } = useLocale();

  return (
    <dl className="triad">
      <div>
        <dt className="label triad__term">{l(ui.role)}</dt>
        <dd className="triad__value">{l(project.role)}</dd>
      </div>
      <div>
        <dt className="label triad__term">{l(ui.stack)}</dt>
        <dd className="triad__value">{project.stack.join(' · ')}</dd>
      </div>
      <div>
        <dt className="label triad__term">{l(ui.period)}</dt>
        <dd className="triad__value">{project.period}</dd>
      </div>
    </dl>
  );
}
