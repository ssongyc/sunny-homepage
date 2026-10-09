# Sunny Innovation Lab Homepage

Static website for Sunny Innovation Lab.

Published URL:

https://sunnyinnolab.com/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
* `sitemap.xml`: sitemap containing the canonical homepage URL only.
* `robots.txt`: allows crawling and advertises the homepage sitemap.
* `worldmovietrailer/index.html`: minimal World Movie Trailer page with centered text.
* `assets/apps/`: app and game images.
* `assets/brand/`: official logo, social preview, favicon, and Apple touch icon.
* `assets/contact-email.svg`: image-based contact email.

## Current Homepage Notes

* Hero section shows text only; the previous right-side app image stack was removed.
* Hero vertical padding is `clamp(42px, 8vw, 64px)`.
* Hero minimum height is `380px`.
* Hero tagline font size is 1px larger than the base section kicker.
* Hero title is sized to stay on one line on desktop with `max-width: 100%` and `font-size: clamp(2.6rem, 5.2vw, 4.5rem)`, capping the title at 72px by default. Mobile wrapping remains allowed.
* Hero copy is `Made with love in Canada & Korea.`
* Primary hero buttons are ordered as `About the Lab`, then `View Games & Apps`.
* About section references Sunny Innovation Lab as a voluntary group representing K-PADA, with K-PADA linked to the Toronto Korean community Facebook group.
* About title uses `font-size: clamp(26px, 3.3vw, 40px)`.
* About section uses a 2-card layout after removing the previous full-development-process paragraph.
* About cards vertically center their text, keep linked inline text wrapped inside each paragraph, and the About section bottom padding is removed to tighten the gap before the apps section.
* About mission copy starts with `Together, we learn, build, and create apps and games that make a difference.`
* Apps and games are displayed in a 2-column desktop grid and 1-column mobile grid.
* Subway Master is listed as a Casual Game app with App Store and Google Play links, positioned after Sky Peacemaker.
* Subway Master, Watermelon Checker, and decibella 2 use lossless 360px/768px WebP variants through responsive `srcset` markup. Their original `subway-master.png`, `watermelon-checker.jpg`, and `decibella-2.png` files remain as compatibility fallbacks, and intrinsic dimensions are declared to stabilize layout.
* LED POP is listed as an LED Banner app with App Store and Google Play links.
* World Book Ranking has App Store, Google Play, and Website buttons. The Website button links to `https://worldbookranking.sunnyinnolab.com/` and uses the same styling as the store buttons.
* `assets/apps/led-pop.png` is used as the LED POP app image.
* decibella 2 is listed as a Sound Tool app with App Store and Google Play links, positioned to the left of decibella.
* Apps section bottom padding is reduced to `clamp(21px, 4vw, 36px)` to tighten the gap before Contact.
* Contact actions are ordered as email, Instagram, X (Twitter), then Threads, without the previous visible `Follow Sunny Innovation Lab` heading.
* Contact section top padding is reduced to `clamp(10.5px, 2vw, 18px)`.
* The contact email is rendered as an image and styled as the primary red button: `contact@sunnyinnolab.com`.
* Footer shows `Sunny Innovation Lab` with Terms and Privacy links beside it.

## Analytics

Google Analytics 4 is loaded directly in `index.html` and
`worldmovietrailer/index.html` with measurement ID `G-3N6GJT6LFE`.

Homepage product buttons send the custom event `app_link_click` with `app_name`,
`destination_type` (`App Store`, `Google Play`, or `Website`), and `link_url`.
The event does not delay or prevent link navigation. It is separate from GA4's
enhanced-measurement `click` event and measures clicks, not app installs.
The Sunny Homepage GA4 property (`539972581`) has event-scoped custom dimensions
`Catalog app name` (`app_name`) and `Destination type` (`destination_type`).
Use them with the `app_link_click` event in Explore for app/destination breakdowns.
On 2026-10-09, one manual World Book Ranking Website click was received in GA4
Realtime with `app_name` and `destination_type`. This verification click counts
as a click, not an app installation.

### Saved Click Report

GA4 Explore report: [Sunny Homepage - App Clicks & Social Campaigns](https://analytics.google.com/analytics/web/#/analysis/a396550436p539972581/edit/ZVRRJAfdSn2l20RSlOervQ).
Open it using the existing account with access to Sunny Homepage.

* `App & Store Clicks`: rows are Catalog app name; columns are Destination type.
* `Social Campaign Clicks`: rows are Session source / medium, Session campaign,
  Session manual ad content, and Catalog app name; columns are Destination type.
  This tab retains other traffic sources for comparison with tagged social traffic.
* Both tabs use Event count and filter Event name exactly to `app_link_click`.
  Enhanced-measurement `click` events are not included or added to this total.
* The default date range is Last 28 days, excluding the current partial day.
  Custom dimensions can take 24-48 hours to become available in regular reports.
  `No data available` is not proof that realtime collection has failed.
* The report measures click events, including repeat clicks, not unique
  installations. Its creation does not publish or edit social posts.

### Social Campaign Links

Use these inbound links in social profiles and promotional posts. Homepage
links pointing out to social accounts or stores remain unchanged. The Profile
links below were saved and verified on 2026-10-09; Post links are templates only.
No existing social post was edited or new post published.

* Instagram `@sunnyinnolab`: the user changed the link in the mobile app;
  the complete saved URL was then verified in the web profile editor.
* Threads `@sunnyinnolab`: the Homepage link was updated and verified after reload.
* X `@Sunnyinnolab`: the HTTPS link was saved and verified after reload.
  With user approval, `utm_content=bio` replaces `profile` to fit X's 100-character
  website limit without removing HTTPS or changing the source/campaign values.
* YouTube `@sunnyinnovationlab` (channel `UCu_fYgi1bE9xHpw7z6AsbBQ`): the existing
  Homepage link was published and verified after reload. The K-PADA link remains
  unchanged.
* LinkedIn Sunny Innovation Lab (company page `103198664`): the Website URL was
  updated and verified after reload. The personal profile remains unchanged.

Other profile/channel information and store marketing, support, and privacy
URLs were not changed by these social-link updates. Channel-attributed traffic
has not yet been verified in GA4 for every link; saved links alone do not prove
that campaign visits have been received.

| Source | Placement | Homepage link |
| --- | --- | --- |
| Instagram | Profile | https://sunnyinnolab.com/?utm_source=instagram&utm_medium=social&utm_campaign=homepage&utm_content=profile |
| Instagram | Post | https://sunnyinnolab.com/?utm_source=instagram&utm_medium=social&utm_campaign=homepage&utm_content=post |
| Threads | Profile | https://sunnyinnolab.com/?utm_source=threads&utm_medium=social&utm_campaign=homepage&utm_content=profile |
| Threads | Post | https://sunnyinnolab.com/?utm_source=threads&utm_medium=social&utm_campaign=homepage&utm_content=post |
| X | Profile | https://sunnyinnolab.com/?utm_source=twitter&utm_medium=social&utm_campaign=homepage&utm_content=bio |
| X | Post | https://sunnyinnolab.com/?utm_source=twitter&utm_medium=social&utm_campaign=homepage&utm_content=post |
| YouTube | Profile | https://sunnyinnolab.com/?utm_source=youtube&utm_medium=social&utm_campaign=homepage&utm_content=profile |
| LinkedIn | Company profile | https://sunnyinnolab.com/?utm_source=linkedin&utm_medium=social&utm_campaign=homepage&utm_content=profile |

Keep UTM values lowercase and consistent. X uses `twitter` as the stable source
label. For individual promotions, use a distinct campaign (for example,
`subway_master_202610`) and content identifier (for example, `post_20261009`).
Do not include email addresses or other personal data in UTM values. Do not add
these campaign tags to internal homepage navigation or canonical/sitemap URLs.
GA4 reads inbound UTM parameters through the existing Google tag; no additional
tracking library is needed. Campaign attribution measures website traffic and
catalog clicks, not store installs.

References: [Google campaign URL guidance](https://support.google.com/analytics/answer/10917952)
and [GA4 custom dimension processing](https://support.google.com/analytics/answer/14240153).

The website has no backend or application API integration. Store, community,
social, Terms, and Privacy destinations are ordinary external links.

## Search Discovery

The homepage canonical URL is `https://sunnyinnolab.com/`. Its sitemap is
`https://sunnyinnolab.com/sitemap.xml`; section anchors are not separate pages.
Google Search Console ownership for `sunnyinnolab.com` was automatically
verified using existing DNS records on 2026-10-09. Keep those verification
records in place. Sitemap submission and indexing requests do not guarantee
that Google has indexed the homepage. World Book Ranking uses its own sitemap.

Bing Webmaster Tools uses the homepage `msvalidate.01` meta tag for ownership
verification. Keep this tag in place after verification. Submit the canonical
`https://sunnyinnolab.com/sitemap.xml` sitemap; registration is not proof of indexing.
Ownership verification and sitemap submission completed on 2026-10-09. Bing
confirmed successful submission and showed `Processing`; indexing is not yet
confirmed.

The homepage title and description identify the mobile games and apps catalog.
Open Graph metadata uses the same title and description. JSON-LD describes the
Organization, its existing official social links, and the WebSite publisher.
The official logo is included in Organization metadata. Open Graph and X/Twitter
summary cards use a 1024px square white-background logo. Favicons (48px and 96px)
and the Apple touch icon (180px) use the sun symbol extracted from the logo.

Brand assets were provided with permission to adapt them from Google Drive:
`https://drive.google.com/drive/folders/1ndpZKgUlx8Zx9dx43KSO2HmgLXmFTmW6`.
The source is `logo_sil_black_1024.png`; the master remains in Drive. The shipped
transparent PNG uses lossless PNG compression, reduced from 32,766 to 30,052
bytes without resizing. The white-background social preview is 31,196 bytes;
48px/96px/180px icons are 2,237/5,042/10,738 bytes. No app/game icon was changed.

## Mobile Performance and Accessibility Review

On 2026-10-09, the public homepage was inspected at 320, 375, 600, 760,
and 1280 CSS-pixel viewport widths; no document-level horizontal overflow
was observed. Below-the-fold catalog images use lazy loading.

[Mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-sunnyinnolab-com/1b6ejl4wqo?form_factor=mobile):
Performance 97, Accessibility 95, Best Practices 100, SEO 100; FCP 0.8s,
LCP 2.6s, TBT 30ms, CLS 0. This is one simulated slow-4G Lighthouse run,
not real-user performance data or a guarantee of search indexing.
Remaining diagnostics include image delivery/dimensions, cache lifetime,
and Google tag JavaScript. Analytics was retained; no image quality was reduced.

Local accessibility changes give navigation/footer links a minimum 44px
width, darken small section labels and the email background, add a visible
keyboard focus outline, and respect reduced-motion preferences. During the
initial local review, these changes were not yet deployed or measured in a
post-change browser run. The browser blocked local file preview; that review
did not run a build, lint, commit, push, or deployment. The existing PageSpeed
scores above describe the public site before these CSS changes.

Store marketing URLs must remain `https://sunnyinnovationlab.blogspot.com`
because of the existing AdMob association. The World Book Ranking English
and Spanish marketing URL changes were reverted and their saved values
verified on 2026-10-09. Support and privacy URLs remain unchanged.
Social profile completion status and saved URLs are recorded in
[Social Campaign Links](#social-campaign-links). Instagram website changes
require its mobile app; the web editor was used only to verify the saved URL.

## Deployment

GitHub Pages deploys from the `main` branch root (`/`). The repository must
remain public and the Pages source must remain set to `main / (root)` for the
site to stay available. The custom domain is declared by `CNAME`, and
Cloudflare DNS points the apex domain and `www` host to GitHub Pages.

* Repository: https://github.com/ssongyc/sunny-homepage
* Website: https://sunnyinnolab.com/
* World Movie Trailer page: https://sunnyinnolab.com/worldmovietrailer/
* Legacy Pages URL (redirects to the website): https://ssongyc.github.io/sunny-homepage/
* Email: `contact@sunnyinnolab.com` is routed directly to Google Workspace.
