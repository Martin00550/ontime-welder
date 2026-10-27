# SEO changes and launch checklist

Primary URL: https://www.ontimeweldingservices.com/

This is an implementation audit of the repository, not a report of search rankings. No Search Console, Analytics, Bing, keyword-volume or competitor datasets were supplied or accessed. Rankings, traffic, leads and AI citations have not been measured, and a number-one position cannot be promised. No Ultraship tooling, API keys, environment variables or cloud configuration changes are needed for these changes.

## Focus and evidence

Keep the homepage as the landing page for the Chilliwack mobile-welding cluster. It covers the seven existing service categories and six documented service-area cities. The service links point to sections on this page; they are not separate indexed landing pages. Do not create near-identical city pages to target each location.

| Area | Before | Implemented |
| --- | --- | --- |
| Search snippet | Brand-only title and H1 | Mobile welding + Chilliwack in the title, H1 and description |
| Canonical | Relative `index.html` | Absolute HTTPS homepage, consistent with social metadata and structured data |
| Discovery | No robots.txt or sitemap.xml | Crawl permission and a sitemap containing the one indexable canonical page |
| Business data | Basic LocalBusiness without site identity | Linked LocalBusiness, WebSite and WebPage entities; seven actual service offers; six cities; existing social profiles |
| Service copy | Short labels | Descriptions, stable service anchors, service-area explanation and five visible question-and-answer entries |
| Lead path | Generic call labels | Free-estimate calls to action and linked phone/email, with instructions for sending photos, dimensions and job location |
| Images | Large originals, repeated generic alt text, missing dimensions | Responsive WebP derivatives, descriptive alt text, intrinsic dimensions and lazy loading below the hero |
| Styling and fonts | Tailwind CDN script and external Google Fonts requests | Prebuilt local CSS and licensed, self-hosted Latin fonts |
| Script failure | Reveal classes initially hid content | Core content stays visible with JavaScript disabled |
| Privacy link | Missing cookies.html | Working, noindex privacy/storage page reflecting the site's actual localStorage use |

The original 24-file WebP set is 6,949,219 bytes. Equivalent default optimized images total 1,628,172 bytes (76.6% smaller); responsive selection and full-size lightbox viewing change actual transfer sizes. The 768px hero is 90,308 bytes versus the 616,407-byte original. Full-resolution source photos remain available for the lightbox. These are file-size comparisons, not measured improvements in live Core Web Vitals.

No ratings, testimonials, years in business, certifications, opening hours, prices or response-time promises have been invented. TIG welding was deliberately excluded because repository history says it is not offered. No plasma-cutting service is advertised merely because the gallery contains decorative cut-metal work.

The visible questions help customers and search engines read the answers. No FAQ rich-result eligibility is claimed: Google generally limits FAQ rich results to authoritative government and health sites. `llms.txt` is an optional factual summary, not a known ranking factor or a guarantee of AI citation. General robots rules permit crawling; model-training bots are not presented as search-citation bots.

## Local verification

Run from the repository root:

```sh
npm ci
npm run build
npm run check
python3 -m http.server 8765 --bind 127.0.0.1
```

The committed `assets/site.css` is production-ready; the deployed site does not need Node.js or a runtime Tailwind compiler. Run the build after changing HTML utility classes or `styles/input.css`. Commit the generated CSS with the source changes. Font files and their OFL licenses are in `assets/fonts/`; they originate from Fontsource variable-font packages, version 5.3.0. Optimized image files are committed alongside the originals.

`npm run check` checks metadata, canonical consistency, image attributes and responsive candidates, local links and anchors, structured business/service data, robots, and sitemap contents. Browser validation also checks mobile/tablet/desktop layout, images, fonts, menu, slider, lightbox navigation and cookie preference storage, including a JavaScript-disabled reading check. Production Lighthouse scores, Google rich-result validation, real-user Core Web Vitals, redirects, HTTP cache headers and crawler access at the public host still need post-deployment checks. The current machine's proxy denied the read-only request to the public domain with HTTP 403, so this is not evidence of a public-site error.

If the primary domain changes, update all generated metadata together:

```sh
npm run set-site-url -- https://www.ontimeweldingservices.com/
npm run check
```

No credentials are required. The generator does not deploy or submit anything to search engines.

## Launch and next priorities

1. Deploy `index.html`, `cookies.html`, `assets/`, `images/`, `robots.txt`, `sitemap.xml` and `llms.txt` through the existing hosting workflow. This change has not been deployed, pushed or submitted to external services. Keep the source/build files in the repository; they do not need to be in the published web root.
2. At the host, redirect HTTP and non-www traffic permanently to `https://www.ontimeweldingservices.com/`. Redirect `/index.html` to `/` if supported. Confirm one redirect path, HTTPS, correct file MIME types, real 404 responses for missing URLs, and HTTP 200 for the sitemap and homepage. Canonical tags alone do not perform redirects. Check that the CDN or firewall allows legitimate search crawlers.
3. In Google Search Console, verify the domain, submit `https://www.ontimeweldingservices.com/sitemap.xml`, inspect the homepage and request indexing after deployment. Repeat sitemap submission in Bing Webmaster Tools. These owner actions do not require adding credentials to this project. A sitemap is discovery guidance; it does not guarantee indexing.
4. Verify and complete the real Google Business Profile: choose the most accurate available category (such as Welder), list actual services, and match the business name, phone and website. Confirm that the published address is accurate and appropriate for customer visits; if it is not a staffed customer-facing location, follow Google's service-area-business address rules. Enter only real hours. Add genuine project photos and request honest reviews from actual customers without incentives. No profile edits or review requests have been sent.
5. Make the existing Facebook/Instagram profiles and legitimate local business listings consistent with the same contact details and canonical website. Seek relevant links from real clients, suppliers and local trade/community organizations. Do not buy links or create duplicate locations.
6. Add project case studies when the owner can provide real scope, material, problem, repair process and permitted photographs. Use those as evidence of experience. Add a dedicated service page only when there is enough distinct first-hand content and search/customer demand to justify it; link it from the homepage and add it to the sitemap then.

## Measure after launch

Save the preceding 28 days of Search Console data and compare with subsequent 28-day periods. Separate brand terms such as “On-Time Welding” and “On Time Welding Services” from non-brand queries. Watch actual impressions, clicks, CTR and average position for mobile welding Chilliwack, welder Chilliwack, welding repairs Chilliwack, aluminum welding Chilliwack and custom metal fabrication Chilliwack. These are relevance-based seed topics, not volume-backed or currently ranking keywords.

Track confirmed phone/email leads and ask customers how they found the business. Without analytics or call-tracking data, clicking a link must not be reported as a completed lead. Check Search Console indexing and mobile Core Web Vitals, and Bing performance/citations where available. Prioritize the actual non-brand queries that earn impressions and relevant leads before expanding content. Review the results after sufficient crawling and traffic; no fixed ranking deadline is asserted.
