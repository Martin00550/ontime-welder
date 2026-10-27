import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

// Publish only website files, keeping dependencies and repository files out.
rmSync('public', { recursive: true, force: true });
mkdirSync('public');
for (const path of ['index.html', 'cookies.html', 'assets', 'images', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  cpSync(path, `public/${path}`, { recursive: true });
}
console.log('Static website built in public/.');
