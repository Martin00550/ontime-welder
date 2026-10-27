// One-time site metadata configuration. No environment variables or credentials.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const input = process.argv[2];
if (!input) throw new Error('Usage: npm run set-site-url -- https://www.example.com/');
const url = new URL(input);
if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('Provide the HTTPS site origin only, with no credentials, path, query or fragment.');
}
const base = url.origin + '/';
const absolute = path => new URL(path, base).href;

for (const file of ['index.html', 'cookies.html']) {
  let html = readFileSync(file, 'utf8');
  const page = file === 'index.html' ? base : absolute(file);
  html = html.replace(/(<link rel="canonical" href=")[^"]+("\/?>)/, `$1${page}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]+("\/?>)/, `$1${page}$2`);
  html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]+("\/?>)/g,
    `$1${absolute('images/optimized/social-preview.jpg')}$2`);
  html = html.replace(/(<script type="application\/ld\+json">)\s*([\s\S]*?)\s*(<\/script>)/g,
    (_, open, source, close) => {
      const data = JSON.parse(source);
      const walk = value => {
        if (Array.isArray(value)) return value.map(walk);
        if (!value || typeof value !== 'object') return value;
        return Object.fromEntries(Object.entries(value).map(([key, item]) => {
          if (['@id', 'url', 'image', 'logo'].includes(key) && typeof item === 'string') {
            // Rebase internal IDs when the primary domain changes; preserve social URLs.
            const previous = new URL(item, base);
            return [key, absolute(previous.pathname + previous.hash)];
          }
          return [key, walk(item)];
        }));
      };
      return `${open}\n${JSON.stringify(walk(data), null, 2)}\n  ${close}`;
    });
  writeFileSync(file, html);
}

writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`);
// Do not invent lastmod timestamps or include fragments / noindex privacy pages.
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}</loc>
  </url>
</urlset>
`);
writeFileSync('llms.txt', `# On-Time Welding Services

> Mobile welding, metal repairs and custom fabrication based in Chilliwack, British Columbia, Canada.

## Business details
- Phone: +1 604-791-3422
- Email: on-timewelding@hotmail.com
- Address: 8594 Broadway Ave, Chilliwack, BC, Canada
- Service area: Chilliwack, Abbotsford, Langley, Surrey, Vancouver and Coquitlam, BC

## Pages
- [Welding services](${base}#services): Stick, MIG, flux core and aluminum welding; gates, railings, equipment repairs and custom metal fabrication.
- [Project gallery](${base}#gallery): Photos of repair and fabrication projects.
- [Service area](${base}#service-area): Mobile welding locations; call to confirm availability.
- [Welding questions](${base}#faq): Service details and what to include in an estimate request.
- [Request an estimate](${base}#contact): Contact information for a free, no-obligation estimate.
- [Privacy and browser storage](${absolute('cookies.html')}): Browser preference storage and external links.

The website is the source of truth. No ratings, certifications, prices or opening hours are asserted here.
`);
console.log(`Updated canonical URLs, social images, structured data and discovery files for ${base}`);
