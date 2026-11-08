import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
if (process.argv[2]) process.chdir(process.argv[2]);
const read = path => readFileSync(path, 'utf8');
const serviceData = JSON.parse(readFileSync(new URL('../data/services.json', import.meta.url), 'utf8'));
const pages = ['index.html', 'cookies.html', 'services.html', ...serviceData.map(s=>s.slug+'.html')];
const resolvePage = path => existsSync(path) ? path : existsSync(path+'.html') ? path+'.html' : path;
const html = read('index.html');
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
const base = new URL(canonical);
assert.equal(base.protocol, 'https:');
assert.equal(base.pathname, '/');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Homepage needs exactly one H1');
assert.match(html, /<title>[^<]*Chilliwack[^<]*<\/title>/);
assert.match(html, /<h1[^>]*>[^<]*Chilliwack/);
assert.match(html, /<meta name="description" content="[^"]+"/);
assert.equal(html.match(/<meta property="og:url" content="([^"]+)"/)[1], canonical);
assert.equal(html.match(/<meta property="og:image" content="([^"]+)"/)[1], new URL('images/optimized/social-preview.jpg', base).href);

let checkedAssets = 0;
for (const page of pages) {
  const source = read(page);
  assert.equal((source.match(/<link rel="canonical"/g) || []).length, 1);
  assert.match(source, /<link rel="icon" href="\/favicon-96x96\.png" type="image\/png" sizes="96x96"\/>/, 'Pages need a crawlable square favicon');
  assert(!/<link rel="icon"[^>]+href="data:/.test(source), 'Embedded icons are not crawlable favicon URLs');
  assert(!/<script[^>]+src="https?:/.test(source), 'No third-party runtime scripts');
  assert(!/<link[^>]+href="https:\/\/fonts\./.test(source), 'Fonts should be self-hosted');
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${page} contains duplicate IDs`);
  for (const [, attribute, value] of source.matchAll(/\b(src|href)="([^"]+)"/g)) {
    if (/^(?:data:|mailto:|tel:|https?:)/.test(value)) continue;
    const url = new URL(value, new URL(page, base));
    const path = resolvePage(decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html');
    assert(existsSync(path), `${page}: missing ${attribute} target ${value}`);
    if (url.hash && path.endsWith('.html')) {
      assert(read(path).includes(`id="${url.hash.slice(1)}"`), `${page}: broken anchor ${value}`);
    }
    checkedAssets++;
  }
  for (const [, candidates] of source.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of candidates.split(',')) {
      const path = candidate.trim().split(/\s+/)[0];
      assert(existsSync(path), `Missing responsive image ${path}`);
    }
  }
  for (const [tag] of source.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt="[^"]*"/, 'Images need alt text');
    if (tag.includes('src="data:')) continue;
    assert.match(tag, /\bwidth="\d+"/, 'Images need intrinsic width');
    assert.match(tag, /\bheight="\d+"/, 'Images need intrinsic height');
  }
}
assert.match(read('cookies.html'), /name="robots" content="noindex, follow"/);
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const business = graph.find(item => item['@type'] === 'LocalBusiness');
assert.equal(business.url, canonical);
assert.equal(business.telephone, '+16047913422');
assert.equal(business.address.addressLocality, 'Chilliwack');
assert.equal(business.areaServed.length, 6);
assert(!business.aggregateRating && !business.review, 'Do not fabricate reviews');
assert(!business.openingHours && !business.openingHoursSpecification, 'Do not invent opening hours');
for (const offer of business.hasOfferCatalog.itemListElement) {
  const service = offer.itemOffered;
  const url = new URL(service.url);
  assert.equal(url.origin, base.origin);
  assert(existsSync(resolvePage(url.pathname.slice(1))), `Service page missing: ${service.name}`);
  assert.equal(service.provider['@id'], business['@id']);
}
assert.match(read('robots.txt'), /User-agent: \*\nAllow: \/\n/);
assert(read('robots.txt').includes(`Sitemap: ${new URL('sitemap.xml', base).href}`));
const sitemapURLs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(sitemapURLs, [canonical, new URL('services',base).href, ...serviceData.map(s=>new URL(s.slug,base).href)], 'Sitemap must contain every indexable canonical page once');
for (const service of serviceData) {
 const source=read(service.slug+'.html');
 const url=new URL(service.slug,base).href;
 assert.equal((source.match(/<h1\b/g)||[]).length,1);
 assert(source.includes(`<link rel="canonical" href="${url}"/>`));
 assert(html.includes(`href="/${service.slug}"`),'Every service needs a homepage link');
 const nodes=JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const detail=nodes.find(n=>n['@type']==='Service');
 assert.equal(detail.url,url);
 assert.equal(detail.provider['@id'],business['@id']);
 assert(nodes.some(n=>n['@type']==='BreadcrumbList'));
 assert(source.includes('href="/services"'));
 for(const related of service.related) assert(source.includes(`href="/${related}"`));
}
assert(!existsSync('roadside-welding-repair.html'),'Roadside service is not confirmed');
assert(read('llms.txt').includes(canonical));
assert(existsSync('assets/site.css'), 'Run npm run build before checking');
for (const [, font] of read('assets/site.css').matchAll(/url\(["']?(\.\/fonts\/[^)"']+)/g)) {
  assert(existsSync(`assets/${font}`), `Missing font ${font}`);
}
console.log(`SEO checks passed: metadata, ${checkedAssets} local links/assets, responsive images, 9 indexable pages, 7 services, 6 cities, structured data, robots and sitemap.`);
