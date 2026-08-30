// GitHub Pages serves static files only: a deep link like /work/orbit 404s because
// no such file exists. Copying index.html to 404.html makes Pages hand the SPA
// shell back for any unknown path, and the router resolves the route client-side.
// .nojekyll stops Pages from running Jekyll over the build output.
import { copyFile, writeFile } from 'node:fs/promises';

await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
console.log('spa-fallback: wrote dist/404.html and dist/.nojekyll');
