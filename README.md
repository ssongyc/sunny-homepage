# Sunny Innovation Lab Homepage

Static homepage for Sunny Innovation Lab.

Published URL:

https://ssongyc.github.io/sunny-homepage/

## Structure

* `index.html`: homepage content and product order.
* `styles.css`: responsive layout and visual styling.
* `script.js`: smooth in-page anchor scrolling.
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
* About section uses a 2-card layout after removing the previous full-development-process paragraph.
* About mission copy starts with `Together, we learn, build, and create apps and games that make a difference.`
* Apps and games are displayed in a 2-column desktop grid and 1-column mobile grid.
* Contact actions are ordered as email, Instagram, then X (Twitter), without the previous visible `Follow Sunny Innovation Lab` heading.
* The contact email is rendered as an image and styled as the primary red button: `contact@sunnyinnolab.com`.
* Footer shows `Sunny Innovation Lab` with Terms and Privacy links beside it.

## Deployment

GitHub Pages is enabled from the `main` branch root:

* Repository: https://github.com/ssongyc/sunny-homepage
* Pages URL: https://ssongyc.github.io/sunny-homepage/
