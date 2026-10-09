# Sunny Innovation Lab Homepage

Static website for Sunny Innovation Lab.

Published URL:

https://sunnyinnolab.com/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
* `CNAME`: GitHub Pages custom domain (`sunnyinnolab.com`).
* `sitemap.xml`: sitemap containing the canonical homepage URL only.
* `robots.txt`: allows crawling and advertises the homepage sitemap.
* `worldmovietrailer/index.html`: legacy placeholder with centered World Movie Trailer text; not the separately hosted movie web app.
* `assets/apps/`: app and game images.
* `assets/brand/`: official logo, social preview, favicon, and Apple touch icon.
* `assets/contact-email.svg`: image-based contact email.

This repository is plain HTML/CSS with inline JavaScript, without a package
manager, local build command, or backend. Open `index.html` in a browser for
local layout preview; publishing is handled by GitHub Pages.

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

### Saved Traffic and Click Report

GA4 Explore report: [Sunny Homepage - App Clicks & Social Campaigns](https://analytics.google.com/analytics/web/#/analysis/a396550436p539972581/edit/ZVRRJAfdSn2l20RSlOervQ).
Open it using the existing account with access to Sunny Homepage.

* `App & Store Clicks`: rows are Catalog app name; columns are Destination type.
* `Social Campaign Clicks`: rows are Session source / medium, Session campaign,
  Session manual ad content, and Catalog app name; columns are Destination type.
  This tab retains other traffic sources for comparison with tagged social traffic.
* Both tabs use Event count and filter Event name exactly to `app_link_click`.
  Enhanced-measurement `click` events are not included or added to this total.
* `Social Traffic & Engagement`: rows are Session source / medium, Session
  campaign, and Session manual ad content; values are Active users, Sessions,
  and Engagement rate. It has no event filter, app-name row, or destination
  column, so ordinary visits are not restricted to users who clicked a button.
* `Social Store Clicks`: retains the social/app rows and destination columns,
  with Event count filtered to `app_link_click` and Destination type matching
  `^(App Store|Google Play)$`. Website clicks are excluded. Compare this tab
  with the traffic summary using the same date range; do not sum these clicks
  with the original click tabs or the derived event below.
* The two additional tabs were saved and verified after reload on 2026-10-09.
* The default date range is Last 28 days, excluding the current partial day.
  Custom dimensions can take 24-48 hours to become available in regular reports.
  `No data available` is not proof that realtime collection has failed.
* Click tabs measure events, including repeat clicks, not unique installations.
  The traffic summary measures website visits and engagement. Report changes
  do not publish or edit social posts.

### Store Click Key Event

On 2026-10-09, GA4 configuration for the Sunny Homepage stream was saved and
read back with these settings:

* Derived event: `app_store_click`.
* Source event: `event_name` equals `app_link_click`.
* Additional condition: `destination_type` matches `^(App Store|Google Play)$`.
* Source parameters are copied, preserving app name, destination, and link URL.
* Marked as a key event, counted once per event, without a default monetary value.

The existing source event remains unchanged; Website clicks are still tracked
by `app_link_click` but do not generate this key event. The derived event is
configured in GA4, not emitted separately by homepage code. No Google Ads
conversion or advertising integration was added. Configuration persistence was
verified; actual receipt of the new derived event is not yet verified. Do not
treat it as an installation, revenue, or retroactive reprocessing of old clicks.

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
URLs were not changed by these social-link updates. On 2026-10-09, manual visits
to all five saved UTM addresses appeared in GA4 Realtime `page_view` /
`page_location`, one event per address. These are QA visits, not evidence of
organic social performance or five unique users. The addresses were opened
directly, so this does not verify every social platform's redirect behavior.
Separate channel-attributed sessions remain unverified: visits in the same
session must not be interpreted as five independently attributed sessions.

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

Accessibility changes give navigation/footer links a minimum 44px
width, darken small section labels and the email background, add a visible
keyboard focus outline, and respect reduced-motion preferences. During the
initial local review, these changes were not yet deployed or measured in a
post-change browser run. The browser blocked local file preview; that review
did not run a build, lint, commit, push, or deployment. The existing PageSpeed
scores above describe the public site before these CSS changes.

Subsequent delivery on 2026-10-09 committed those changes in
`f63d23505d6eb2af5462f2a75704f28224e435a1`. The GitHub Pages
[deployment run](https://github.com/ssongyc/sunny-homepage/actions/runs/37926329801)
completed successfully, and the public stylesheet contained the updated rules.
A post-deployment visual/accessibility measurement was not completed; the
existing PageSpeed scores are still the pre-change results.

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
* Legacy World Movie Trailer placeholder: https://sunnyinnolab.com/worldmovietrailer/
* Legacy Pages URL (redirects to the website): https://ssongyc.github.io/sunny-homepage/
* Email: `contact@sunnyinnolab.com` is routed directly to Google Workspace.

World Book Ranking and the movie web app use separate hosting/projects; this
repository does not contain their application code or deployment configuration.

## Maintenance Review

On 2026-10-09, the tracked HTML, CSS, assets, crawler files, and domain declaration
were reviewed for references. No unused file or application API was confirmed.
Keep the original PNG/JPG images used by `<picture>` compatibility sources,
responsive WebP variants, structured-data/social-preview logos, favicon/touch
icons, Google tag, and the legacy direct-access page. Absence from the navigation
alone does not make a public page unused. This review ran no build, lint, or test.
