# Sunny Innovation Lab Homepage

Static website for Sunny Innovation Lab.

Published URL:

https://sunnyinnolab.com/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
* `worldmovietrailer/index.html`: minimal World Movie Trailer page with centered text.
* `assets/apps/`: app and game images.
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

The website has no backend or application API integration. Store, community,
social, Terms, and Privacy destinations are ordinary external links.

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
