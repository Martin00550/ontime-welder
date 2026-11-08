import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sizeOf } from './image-size.mjs';
process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const services = JSON.parse(readFileSync('data/services.json', 'utf8'));
const homepage = readFileSync('index.html', 'utf8');
const base = homepage.match(/<link rel="canonical" href="([^"]+)"/)[1];
const abs = path => new URL(path, base).href;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const graph = JSON.parse(homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const business = graph.find(x=>x['@type']==='LocalBusiness');
const website = graph.find(x=>x['@type']==='WebSite');
const arrow = '<span aria-hidden="true">&rarr;</span>';
const messagingLinks = [{"label": "Message on WhatsApp", "href": "https://wa.me/16047913422", "icon": "<svg aria-hidden=\"true\" fill=\"currentColor\" viewBox=\"0 0 24 24\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.581-.075-.21-.67-1.61-.919-2.204-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.899 6.994c-.003 5.45-4.437 9.884-9.887 9.884m8.988-18.874A11.8 11.8 0 0012.051 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.556 0 11.891-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\"/></svg>"}, {"label": "Send an SMS", "href": "sms:+16047913422", "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M7 10h10M7 14h6\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>"}, {"label": "Message on Instagram", "href": "https://www.instagram.com/ontimewelding/", "icon": "<svg aria-hidden=\"true\" fill=\"currentColor\" viewBox=\"0 0 24 24\"><path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z\"/></svg>"}];
function messageLinks() {
 return `<div class="service-messaging"><p>Or message me on</p><div class="service-messaging-links">${messagingLinks.map(link=>`<a href="${link.href}" aria-label="${link.label}" title="${link.label}"${link.href.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${link.icon}</a>`).join('')}</div></div>`;
}
function head(title, description, path, image, nodes) {
 const url=abs(path);
 return `<!DOCTYPE html><html lang="en-CA"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)} | On-Time Welding</title>
<meta name="description" content="${esc(description)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${url}"/>
<meta property="og:type" content="website"/><meta property="og:locale" content="en_CA"/>
<meta property="og:site_name" content="On-Time Welding Services"/><meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(title)} | On-Time Welding Services"/><meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${abs(image)}"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(title)} | On-Time Welding Services"/>
<meta name="twitter:description" content="${esc(description)}"/><meta name="twitter:image" content="${abs(image)}"/>
<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16 32x32 48x48"/>
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"/>
<link rel="stylesheet" href="/assets/site.css"/>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[business,website,...nodes]}).replaceAll('<','\\u003c')}</script>
</head><body class="service-document">
<a class="service-skip" href="#main-content">Skip to content</a>
<header class="service-header"><a href="/" aria-label="On-Time Welding Services home"><img src="/images/optimized/logo.webp" width="872" height="286" alt="On-Time Welding Services"/></a><nav aria-label="Main navigation"><a href="/">Home</a><a href="/services"${path==='services'?' aria-current="page"':''}>Services</a><a href="/#gallery">Our work</a><a class="service-nav-call" href="tel:+16047913422">604-791-3422</a></nav></header>
<main id="main-content" tabindex="-1">`;
}
function crumbs(name,path) {
 return {'@type':'BreadcrumbList','@id':abs(path+'#breadcrumbs'),itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base},...(path==='services'?[]:[{'@type':'ListItem',position:2,name:'Welding services',item:abs('services')}]),{'@type':'ListItem',position:path==='services'?2:3,name,item:abs(path)}]};
}
function card(s) { return `<a class="service-card" href="/${s.slug}"><span class="section-kicker">${esc(s.short)}</span><h3>${esc(s.name)}</h3><p>${esc(s.intro)}</p><span class="service-card-link">Explore this service ${arrow}</span></a>`; }
function footer() { return `</main><footer class="service-footer"><div><a href="/" class="service-footer-brand">On-Time Welding Services</a><p>8594 Broadway Ave, Chilliwack, BC, Canada</p><p><a href="tel:+16047913422">604-791-3422</a> · <a href="mailto:on-timewelding@hotmail.com">on-timewelding@hotmail.com</a></p></div><nav aria-label="All welding services">${services.map(s=>`<a href="/${s.slug}">${esc(s.name)}</a>`).join('')}</nav><p class="service-footer-bottom">&copy; 2026 On-Time Welding Services. <a href="/cookies">Privacy &amp; storage</a></p></footer></body></html>\n`; }
function quote() { return `<section class="service-quote" id="estimate"><div><span class="section-kicker">One conversation. A clear starting point.</span><h2>Let’s talk about<br/>your next project.</h2><p>Call for a free, no-obligation estimate. Send photos, measurements and your job location so we can discuss the work.</p></div><div><a class="area-button" href="tel:+16047913422">Call 604-791-3422 ${arrow}</a><a class="service-email" href="mailto:on-timewelding@hotmail.com">Send your project details by email ${arrow}</a><p>Based in Chilliwack. Serving Abbotsford, Langley, Surrey, Vancouver and Coquitlam. Call to confirm availability.</p></div></section>`; }
for (const s of services) {
 const url=abs(s.slug);const image='images/optimized/'+s.image;const dimensions=sizeOf(image);
 const service={'@type':'Service','@id':url+'#service',url,name:s.name,description:s.intro,serviceType:s.name,provider:{'@id':business['@id']},areaServed:business.areaServed};
 const page={'@type':'WebPage','@id':url+'#webpage',url,name:s.title,description:s.description,isPartOf:{'@id':website['@id']},about:{'@id':service['@id']},breadcrumb:{'@id':url+'#breadcrumbs'},inLanguage:'en-CA'};
 const html=head(s.title,s.description,s.slug,image,[service,page,crumbs(s.name,s.slug)])+`
<section class="service-hero"><div class="service-hero-copy"><nav class="service-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><span aria-current="page">${esc(s.name)}</span></nav><p class="section-kicker">${esc(s.short)} · Chilliwack, BC</p><h1>${esc(s.title)}</h1><p class="service-lead">${esc(s.intro)}</p><a class="area-button" href="tel:+16047913422">Get a free estimate ${arrow}</a><a class="service-work-link" href="/#gallery">See our work ${arrow}</a>${messageLinks()}</div><figure class="service-hero-image"><img src="/${image}" alt="${esc(s.alt)}" width="${dimensions[0]}" height="${dimensions[1]}" fetchpriority="high"/><figcaption>On-Time Welding Services / Project gallery</figcaption></figure></section>
<section class="service-body"><div class="service-story"><p class="section-kicker">The work, explained</p><h2>${esc(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<a class="service-inline-link" href="/#gallery">Browse the project gallery ${arrow}</a></div><aside class="service-brief"><p class="section-kicker">A better first conversation</p><h2>What to send<br/>for your estimate.</h2><ol>${s.prepare.map((p,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(p)}</li>`).join('')}</ol><a href="mailto:on-timewelding@hotmail.com">Email your project details ${arrow}</a></aside></section>
<section class="service-applications"><p class="section-kicker">Where this service fits</p><h2>${esc(s.name)} enquiries</h2><div class="service-application-grid">${s.uses.map(([h,p],i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>
<section class="service-faq"><div><p class="section-kicker">Before we get to work</p><h2>${esc(s.name)}.<br/>Your questions, answered.</h2></div><div>${s.faqs.map(([q,a],i)=>`<details class="question-item"${i===0?' open':''}><summary><span class="question-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h3>${esc(q)}</h3><span class="question-toggle" aria-hidden="true"></span></summary><div class="question-answer"><p>${esc(a)}</p></div></details>`).join('')}</div></section>
<section class="service-related"><p class="section-kicker">The right service for the job</p><h2>Explore related work.</h2><div class="service-card-grid">${s.related.map(slug=>card(services.find(x=>x.slug===slug))).join('')}</div><a class="service-inline-link" href="/services">View all welding services ${arrow}</a></section>`+quote()+footer();
 writeFileSync(s.slug+'.html',html);
}
const hubDescription='Explore welding services in Chilliwack: mobile repairs, equipment welding, aluminum, gates and custom fabrication. Find the right service and get a free estimate.';
writeFileSync('services.html',head('Welding Services in Chilliwack, BC',hubDescription,'services','images/optimized/hero-1280.webp',[{'@type':'CollectionPage','@id':abs('services#webpage'),url:abs('services'),name:'Welding Services in Chilliwack, BC',isPartOf:{'@id':website['@id']},about:{'@id':business['@id']},breadcrumb:{'@id':abs('services#breadcrumbs')},mainEntity:{'@type':'ItemList',itemListElement:services.map((s,i)=>({'@type':'ListItem',position:i+1,name:s.name,url:abs(s.slug)}))}},crumbs('Welding services','services')])+`<section class="service-hub-heading"><nav class="service-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Services</span></nav><p class="section-kicker">Chilliwack roots. Work that lasts.</p><h1>Welding &amp; fabrication.<br/><em>Find your service.</em></h1><p>From an on-site repair to a piece made to measure, explore the work offered by On-Time Welding Services. Based in Chilliwack, BC, serving the Fraser Valley and surrounding communities.</p>${messageLinks()}</section><section class="service-hub-grid" aria-label="Welding specialties">${services.map(card).join('')}</section>`+quote()+footer());
const urls=[base,abs('services'),...services.map(s=>abs(s.slug))];
writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
let llms=readFileSync('llms.txt','utf8').split('\n## Service pages')[0];
writeFileSync('llms.txt',llms.trimEnd()+`\n\n## Service pages\n- [All services](${abs('services')})\n`+services.map(s=>`- [${s.name}](${abs(s.slug)}): ${s.description}`).join('\n')+'\n');
console.log(`Generated ${services.length} service pages, the services hub and a ${urls.length}-URL sitemap.`);
