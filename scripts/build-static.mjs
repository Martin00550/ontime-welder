import { cpSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

// Publish only website files, keeping dependencies and repository files out.
rmSync('public', { recursive: true, force: true });
mkdirSync('public');
for (const path of ['index.html', 'cookies.html', 'assets', 'images', 'robots.txt', 'sitemap.xml', 'llms.txt', 'favicon.ico', 'favicon-96x96.png', 'apple-touch-icon.png']) {
  cpSync(path, `public/${path}`, { recursive: true });
}
for (const path of readdirSync('.').filter(p => p.endsWith('.html'))) cpSync(path, `public/${path}`);
console.log('Static website built in public/.');
