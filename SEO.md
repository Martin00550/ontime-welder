# SEO implementation and maintenance

Primary domain: https://www.ontimeweldingservices.com/

## Page architecture

| Canonical path | Main intent |
| --- | --- |
| `/` | Welding services and metal fabrication in Chilliwack; business overview |
| `/services` | Service directory and navigation to every specialty |
| `/mobile-welding-chilliwack` | Mobile and on-site welding in Chilliwack and the surrounding service area |
| `/equipment-welding-repair` | Equipment, bucket and auger repairs, hardfacing and cracked weld enquiries |
| `/aluminum-welding` | Aluminum repair and fabrication enquiries |
| `/custom-metal-fabrication` | Individual parts, brackets, light shades and trailer metalwork |
| `/gates-railings-fencing` | Property metalwork: gates, handrails, fencing, window and door covers |
| `/stick-welding` | Stick-welding repair enquiries and preparation details |
| `/mig-flux-core-welding` | MIG/flux core fabrication, production and repair enquiries |

Every specialty is linked from a homepage service card, the services hub, related-service cards and the service-page footer. Existing homepage section IDs remain intact. The homepage has a broader title/H1 than the mobile service page. There are no duplicate city landing pages, separate variants for “on site” and “on-site,” or pages targeting job seekers.

The owner-facing conversation confirmed that roadside welding should remain excluded. TIG, spot welding, stainless steel, cast iron, 24/7 emergency attendance, certification claims, invented case studies and ratings have not been added. Photos are drawn from the existing gallery and are not presented as newly documented case studies.

Content describes the existing service range and the information needed to discuss a job. It does not assert a flat price, response time, guaranteed repair suitability or unverified project outcomes. The page data and its FAQs can be edited when the welder supplies more detailed first-hand information.

## Technical setup

- Self-referencing absolute canonical URLs and distinct page titles/descriptions.
- LocalBusiness, WebSite, Service and WebPage entities; BreadcrumbList on service pages and the hub. The hub uses CollectionPage and ItemList.
- Shared business identity, contact information, six service-area cities and actual social profiles.
- Static, crawlable HTML and links; native FAQ disclosure controls work without JavaScript. No FAQ rich-result promise is made.
- Nine canonical, indexable URLs in `sitemap.xml`. The privacy page is `noindex, follow` and excluded.
- Vercel `cleanUrls: true`: `/aluminum-welding` serves its HTML file; `.html` paths redirect to clean URLs. The existing privacy page now canonicals to `/cookies`.
- Local CSS, licensed self-hosted fonts, optimized gallery images and branded root-level favicons are retained.
- No SPA fallback, fabricated modification dates, external runtime scripts, API keys or environment variables.
- `llms.txt` lists the pages as an optional factual index. It is not an established ranking signal or a guarantee of AI citations.

## Build and edit

```sh
npm ci
npm run build
npm run check
```

Edit service copy in `data/services.json`, shared page markup in `scripts/generate-services.mjs`, and styles in `styles/input.css`. The build generates the seven service HTML files, `services.html`, sitemap and service index in `llms.txt`; compiles CSS; stages only website files to `public/`; then validates the staged output. Commit the generated HTML, CSS and discovery files alongside their sources. Avoid hand-editing generated service HTML because the next build recreates it.

The existing `scripts/set-site-url.mjs` still updates the primary domain and now regenerates service-page metadata and discovery files too:

```sh
npm run set-site-url -- https://www.ontimeweldingservices.com/
```

The committed check covers all ten HTML documents, local assets and clean-path links, anchors, responsive images, canonical service URLs, schema provider references, breadcrumbs, related links, homepage discovery and exact sitemap membership. Browser checks cover all eight new routes at mobile, tablet and desktop widths, image loading, FAQ controls and navigation without JavaScript. The local test server models Vercel's configured clean URL behavior; it does not prove the remote deployment succeeded.

## Evidence and next actions

The user shared an early Search Console report of 4 clicks and 100 impressions over the selected three-month range, plus a query table containing mobile/on-site welding, fabrication and aluminum enquiries. Query-level positions were not supplied. These are relevance signals, not evidence of large search volume, a particular keyword ranking or a forecast of new traffic.

After Vercel deploys the new commit:

1. Verify the new routes, canonical tags, favicon URLs and sitemap on the public domain. Confirm HTTPS, preferred www host, real 404s and no crawler-blocking firewall rules.
2. Resubmit the existing sitemap in Search Console and Bing Webmaster Tools. Inspect the services hub and priority mobile/fabrication pages. Discovery does not guarantee indexing.
3. Keep the Google Business Profile accurate, with real hours, actual service categories and permitted job photos. If the business address is not staffed for customer visits, follow Google's service-area-business rules.
4. Collect actual project details: material, part, problem, work performed and approved photos. Add these to the matching service page before creating additional case-study pages. Do not infer job outcomes or materials from photos alone.
5. Compare equivalent date ranges and country filters. Separate brand queries from non-brand service searches; track impressions, clicks, CTR, positions, indexing and actual calls/estimate enquiries. Link clicks alone are not completed leads.

No new rankings, index status, production Core Web Vitals, backlinks or AI citations have been verified. The changes improve relevance and crawlable architecture; they cannot guarantee a number-one ranking. No automated backlink outreach or external profile edits have been performed.
