# Sunny Innovation Lab Homepage

Static website for Sunny Innovation Lab.

Published URL:

https://sunnyinnolab.com/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
* `analytics.js`: shared production-only GA4 initialization and homepage events.
* `.eslintrc.json`: ESLint 8 recommended rules for browser JavaScript.
* `.htmlvalidate.json`: recommended HTML validation with self-closing void tags.
* `.stylelintrc.json`: CSS correctness checks, without formatting-only rules.
* `CNAME`: GitHub Pages custom domain (`sunnyinnolab.com`).
* `sitemap.xml`: sitemap containing the canonical homepage URL only.
* `robots.txt`: allows crawling and advertises the homepage sitemap.
* `worldmovietrailer/index.html`: legacy placeholder with centered World Movie Trailer text; not the separately hosted movie web app.
* `assets/apps/`: app and game images.
* `assets/brand/`: official logo, social preview, favicon, and Apple touch icon.
* `assets/contact-email.svg`: image-based contact email.

This repository is plain HTML/CSS with vanilla JavaScript, without a package
manager, local build command, or backend. Open `index.html` in a browser for
local layout preview; publishing is handled by GitHub Pages.

### Lint

Lint the shipped JavaScript with ESLint 8 and `.eslintrc.json`:

```powershell
npx --yes eslint@8.57.1 analytics.js --max-warnings 0
```

This is a development-only tool, not a shipped dependency or a build step.
This command may download ESLint into npm's cache if it is not installed.
ESLint 8 is used here to match the existing installed workstation tool; the
legacy configuration is not an ESLint 9+ flat config. This lint scope covers
`analytics.js`, not HTML, CSS, JSON-LD, accessibility or runtime event receipt.

HTML and CSS validation commands (development-only npm cache tools):

```powershell
npx --yes html-validate@11.16.2 index.html worldmovietrailer/index.html
npx --yes stylelint@17.16.0 styles.css --config .stylelintrc.json
```

The CSS rules check syntax-related correctness, unknown properties/functions,
duplicate declarations and invalid hex colors; they are not a full design or
accessibility audit. These commands do not build or deploy the website.

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
* World Movie Trailer also has a Website button after App Store and Google Play, linking to `https://worldmovietrailer.sunnyinnolab.com/` with the same styling. The existing `app_link_click` handler records it with destination type `Website`; it is not a store-click key event.
* `assets/apps/led-pop.png` is used as the LED POP app image.
* decibella 2 is listed as a Sound Tool app with App Store and Google Play links, positioned to the left of decibella.
* Apps section bottom padding is reduced to `clamp(21px, 4vw, 36px)` to tighten the gap before Contact.
* Contact actions are ordered as email, Instagram, X (Twitter), then Threads, without the previous visible `Follow Sunny Innovation Lab` heading.
* Contact section top padding is reduced to `clamp(10.5px, 2vw, 18px)`.
* The contact email is rendered as an image and styled as the primary red button: `contact@sunnyinnolab.com`.
* Footer shows `Sunny Innovation Lab` with Terms and Privacy links beside it.

## Analytics

Google Analytics 4 is initialized by shared `analytics.js` from `index.html` and
`worldmovietrailer/index.html` with measurement ID `G-3N6GJT6LFE`. Only the exact
production hostname `sunnyinnolab.com` loads the Google tag. Local files,
localhost, GitHub Pages hostnames and preview hosts do not send analytics.

### Measurement Improvements - 2026-10-14

Compared with the current World Book Ranking and World Movie Trailer web
implementations, the homepage now uses production gating, a bounded custom
event list and measurement failures logged without blocking navigation.
The existing automatic initial `page_view` is retained. Section anchors and
scroll exposure do not emit synthetic page views. GA4 owns session, engagement,
retention and bounce-rate calculations; this code does not fabricate them.

| Event | Meaning / parameters |
| --- | --- |
| `app_link_click` | Existing event retained; `app_name`, `destination_type`, `link_url`, plus `app_category` |
| `navigation_click` | Anchor navigation; `section`, `menu_location` |
| `section_view` | Section exposure; `section` |
| `app_card_view` | Product exposure; `app_name`, `app_category` |
| `social_link_click` | Contact social links; `destination_type`, `link_url` |
| `policy_link_click` | Terms/Privacy; `destination_type`, `link_url` |
| `community_link_click` | About community link; `destination_type`, `link_url` |

Exposure means at least 10% of the element intersects the viewport continuously
for one second while the document is visible. Each element is counted once per
document load, not once per session or unique user. Hidden tabs cancel the timer.
These are element exposure metrics, not proof of reading, installs or purchases.
Existing enhanced-measurement `scroll` (90% depth) and outbound `click` remain
separate; do not sum them with these custom events as a single action total.

Existing `app_name` and `destination_type` custom dimensions remain compatible.
On 2026-10-14, event-scoped dimensions were saved in GA4: `Homepage section`
(`section`), `Navigation location` (`menu_location`) and `App category`
(`app_category`). Compare `app_card_view` with `app_link_click`
by app using the same date range; repeat clicks mean this is not a unique-user
conversion rate. No email/user ID is added to custom parameters. Link URLs are
existing fixed site destinations, not arbitrary inbound query values.

Baseline: clean `main` at `55540a445753454a0d2cfd395c048b5eac2a8d0c`.
The user approved main delivery, publication and GA4 console/report setup.
No local build, lint or test was run; this static repository has no build step.
GitHub Pages publishes from `main` at the repository root. Production collection
and report availability must be verified separately from source publication.

Delivery verification on 2026-10-14: implementation commit `4aba7ec` was pushed
to `origin/main`; GitHub Pages run `38602092154` completed successfully. Public
homepage and `analytics.js` returned HTTP 200 with the new shared script.
The three new custom dimensions remained saved after reload. GA4 Realtime
received `app_card_view`, `section_view` and `navigation_click` during one manual
homepage/Apps navigation check. These are QA events, not organic customer
activity. App/store, social, policy and community click receipt was not newly
verified in this update. No local automated tests or lint were executed.

Saved exploration: [Sunny Homepage - Visits & Interactions](https://analytics.google.com/analytics/web/#/analysis/a396550436p539972581/edit/rqgUmfCKSISdtALez4TwQg).
All five tabs persisted after reload:

* `Daily Visits`: Date rows (up to 50); Active users, New users, Returning users,
  Sessions, Engagement rate and Bounce rate. No event filter restricts visits.
* `Interaction Events`: Event name rows and Event count; includes automatic and
  custom events as separate rows, not deduplicated actions.
* `App Exposure & Clicks`: Catalog app name rows, Event name columns, Event count;
  filter `^(app_card_view|app_link_click)$`.
* `Weekly Retention`: first-touch acquisition cohorts, Any event return criterion,
  weekly granularity, Standard calculation and Active users. Returning users in
  the daily table are not a substitute for cohort retention.
* `Section Engagement`: Homepage section rows, Event name columns, Event count;
  filter `^(section_view|navigation_click)$`.

The new exploration does not replace the existing App Clicks & Social Campaigns
report or modify `app_store_click` key-event configuration. Default range is
Last 28 days excluding today. New events/dimensions may be empty until GA4
processes new traffic; current-day Realtime receipt is separate evidence.
References: [GA4 page views](https://developers.google.com/analytics/devguides/collection/ga4/views)
and [enhanced measurement](https://support.google.com/analytics/answer/9216061).

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

### Reports Snapshot - 2026-10-14

[Sunny Homepage Reports snapshot](https://analytics.google.com/analytics/web/#/a396550436p539972581/reports/reportinghub)
was configured using the World Movie Trailer-Web snapshot as a reference.
The User behavior template was selected and customized; saving and reloading
confirmed the configuration. World Movie Trailer-Web was read only.

* Top metrics: Active users, New users, Average engagement time per active user,
  Event count.
* Ten cards: Top pages/screens (including bounce rate), New vs Returning users,
  engagement time, Event count by Event name, Sessions by Session primary channel
  group, Active users by Device category, Realtime, Sessions/Active users/Key
  events, Total users/Views/Event count and User retention.
* Movie-country-specific cards were not copied to the homepage. App and section
  breakdowns remain in the saved exploration above; the snapshot's event-name
  card includes homepage custom events when they are available in its date range.
* The selected report range is Last 28 days excluding today; User retention uses
  its own Last 42 days window shown on that card. The realtime card covers the
  last 30 minutes. Do not interpret these different periods as the same total.

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

On 2026-10-12, the scheduled one-time recheck showed `Success` and `Sitemap
processed successfully` for the homepage sitemap, last read 2026-10-09, with one
discovered page. The public response was HTTP 200 with `application/xml` and a
valid `urlset`; robots.txt allowed crawling. No resubmission, DNS, code or console
setting change was made, and the completed one-time automation was deleted.
The earlier `Couldn't fetch` cause was not established. Sitemap success is not
proof of indexing or ranking.

The 2026-10-11 unparsable structured-data alert in the domain property affected
`https://worldbookranking.sunnyinnolab.com/`, not this homepage. Its separate
repository fixed escaped JSON-LD quotes in commit `f895220`, and public home,
About and Bookmarks JSON-LD parsing was verified after deployment. Google
validation was started on 2026-10-11. On 2026-10-14 the authenticated Search
Console report showed `Validation passed` (passed 2026-10-12), affected pages 0,
last report update 2026-10-13. No new validation request was submitted.

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
* Current website (legacy Pages redirects here): https://sunnyinnolab.com
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

On 2026-10-14, maintenance started from clean `main` at
`10dbabd0b4726ce4430596e71b5278b6019986b1`. All 27 image assets are referenced
by the HTML/metadata; no unused file or application API was confirmed. The
legacy direct-access page and compatibility images remain intentionally kept.
Removed the redundant 1040px About-grid rule: the base rule already uses two
equal columns, and the existing 760px breakpoint still changes it to one column.
Updated this README with the saved Reports snapshot and lint procedure.
Ran the existing installed ESLint 8.57.1 using
`node C:/dev/WorldBookRanking-Web/mobileToWeb/node_modules/eslint/bin/eslint.js analytics.js --max-warnings 0`:
exit 0, no errors or warnings. No package was installed and no dependency files
in the other repository were changed. No build, tests, commit, push or deployment
was performed for this maintenance update.

### Documentation Delivery - 2026-10-14

Reviewed all outstanding homepage changes: README updates, removal of the
redundant About-grid CSS rule, and the ESLint configuration all belong to this
conversation. Earlier Analytics source and verification records are already
in `4aba7ec` and `10dbabd`. The homepage has only its main worktree/branch.
The separately affected World Book Ranking checkout was also clean with only
its main worktree; no changes were taken from other contributors or merged.
This delivery runs no build, lint or tests; the lint result above is the prior
authorized run. Commit/push triggers the existing Pages publication workflow,
but this delivery does not claim a new completed deployment or runtime check.

Remaining verification: HTML/CSS lint and post-change accessibility/layout
checks, fresh receipt checks for app/store/social/policy/community clicks, and
the final Google structured-data validation result. These limits do not mean
the saved GA4 dimensions, explorations or Reports snapshot are unfinished.

### Additional Verification - 2026-10-14

Started from clean `main` at `923bd20114a0f7500f4b17f403c4b3f489263164`.
The previous remaining-verification list above records the delivery-time state;
the checks requested afterwards are recorded here.

* HTML validation initially reported 10 errors. Corrected uppercase DOCTYPEs,
  encoded text ampersands without changing displayed wording, assigned the
  existing hero action label to a group, and assigned the existing email label
  to an image role. Both HTML files then passed html-validate 11.16.2, exit 0.
* styles.css passed Stylelint 17.16.0 before and after the color correction,
  exit 0. analytics.js passed the existing ESLint 8.57.1, exit 0. No local build
  or production deployment was performed for these corrections.
* Public and corrected local pages were checked at 320, 375, 600, 760 and 1280px
  widths, 900px height: no horizontal overflow and no major navigation/store/
  action/footer target smaller than 44x44 CSS px. Desktop/mobile screenshots
  were visually inspected. All 27 local image asset URLs returned HTTP 200.
* DOM accessibility checks found no missing image alt attributes, unnamed links
  or duplicate IDs; one main landmark, one H1 and English document language.
  A keyboard Tab check showed visible solid focus on the home link. Computed
  text contrast was checked for 99 text/link elements: two small hero text
  styles were below 4.5:1 (3.90 and 4.13). Both were changed to white, with
  corrected local contrast 4.88:1. No new notice or visible wording was added.
* Local loading did not load the Google tag. Operating-site clicks reached
  Subway Master on App Store and Google Play, World Book Ranking Website,
  Instagram, X, Threads, Terms, Privacy and K-PADA. This samples store platforms
  and event types; it does not verify every catalog app listing.
* GA4 Realtime received app_link_click 3, app_store_click 2, policy_link_click 2,
  community_link_click 1 and social_link_click 3 in the verification window.
  Instagram and X were first confirmed in destination_type. Threads was not
  visible after the first rapid navigation sequence; a separate manual click
  after page loading raised social_link_click to 3; the destination_type detail
  then showed Instagram, Threads and X (Twitter), one event each. These are QA
  visits/clicks, not organic acquisition or installs. No automatic retry logic
  was added.
* Google structured-data validation passed as recorded in Search Discovery.

These checks are not WCAG certification, a screen-reader/device audit or a new
Lighthouse performance score. At the end of verification, the HTML and contrast
corrections had not yet been committed or published; the operating site still
used its pre-correction markup and hero text colors.

### Verification Delivery - 2026-10-14

The user authorized documentation, commit and push of the homepage corrections.
Reviewed all six outstanding files: README.md, index.html, styles.css,
worldmovietrailer/index.html, .htmlvalidate.json and .stylelintrc.json. All belong
to this conversation; previous homepage changes are already committed. There
is only one homepage branch/worktree, main. No merge is needed or performed.
The separate WorldBookRanking-Web checkout has newer unrelated/unclear changes;
the user explicitly chose homepage-only delivery and preservation of those
changes. They are not staged, committed or modified by this delivery.
No build, lint or tests are rerun for this delivery. The verification results
above describe the prior authorized checks. GitHub Pages publication is
triggered by pushing main; production completion and post-publication checks
are not newly verified in this commit/push-only task.
