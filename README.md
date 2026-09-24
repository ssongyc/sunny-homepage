# Sunny Innovation Lab Homepage

Static homepage for Sunny Innovation Lab.

Published URL:

https://ssongyc.github.io/sunny-homepage/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
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
* `assets/apps/subway-master.png` is used as the Subway Master app image.
* LED POP is listed as an LED Banner app with App Store and Google Play links.
* `assets/apps/led-pop.png` is used as the LED POP app image.
* decibella 2 is listed as a Sound Tool app with App Store and Google Play links, positioned to the left of decibella.
* `assets/apps/decibella-2.png` is used as the decibella 2 app image.
* Apps section bottom padding is reduced to `clamp(21px, 4vw, 36px)` to tighten the gap before Contact.
* Contact actions are ordered as email, Instagram, X (Twitter), then Threads, without the previous visible `Follow Sunny Innovation Lab` heading.
* Contact section top padding is reduced to `clamp(10.5px, 2vw, 18px)`.
* The contact email is rendered as an image and styled as the primary red button: `contact@sunnyinnolab.com`.
* Footer shows `Sunny Innovation Lab` with Terms and Privacy links beside it.

## Analytics

Google Analytics 4 is loaded directly in `index.html` with measurement ID
`G-3N6GJT6LFE`.

## Deployment

GitHub Pages deploys from the `main` branch root (`/`). The repository must
remain public and the Pages source must remain set to `main / (root)` for the
site to stay available.

* Repository: https://github.com/ssongyc/sunny-homepage
* Pages URL: https://ssongyc.github.io/sunny-homepage/
