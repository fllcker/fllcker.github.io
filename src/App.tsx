import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Bar } from './components/Bar';
import { Rule, usePointerRules } from './components/Rule';
import { Index } from './routes/Index';
import { NotFound } from './routes/NotFound';
import { Project } from './routes/Project';

export function App() {
  const location = useLocation();

  // Свет по линейкам; пересобирает список после каждой смены маршрута.
  usePointerRules(location.pathname);

  return (
    <>
      <div className="gridlines" aria-hidden="true">
        <div className="gridlines__inner" />
      </div>

      <ScrollManager />
      <Bar />

      <main className="page">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Rule />
    </>
  );
}

/**
 * Маршрут меняется — страница начинается сверху; якорь есть — идём к нему.
 * Без этого переход «страница работы → /#contact» оставляет читателя
 * в середине предыдущего экрана.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
