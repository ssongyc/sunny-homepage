(() => {
  'use strict';

  const measurementId = 'G-3N6GJT6LFE';
  const production = location.hostname === 'sunnyinnolab.com';
  window[`ga-disable-${measurementId}`] = !production;
  if (!production) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.addEventListener('error', () => console.warn('[Analytics] Google tag failed to load'));
  document.head.appendChild(script);

  const events = new Set([
    'app_link_click', 'navigation_click', 'section_view',
    'app_card_view', 'social_link_click', 'policy_link_click', 'community_link_click'
  ]);
  function track(name, parameters) {
    if (!events.has(name) || window[`ga-disable-${measurementId}`]) return;
    try {
      window.gtag('event', name, { send_to: measurementId, ...parameters });
    } catch (error) {
      console.warn(`[Analytics] ${name} failed`, error);
    }
  }

  function appDetails(card) {
    return {
      app_name: card.querySelector('h3').textContent.trim(),
      app_category: card.querySelector('.genre').textContent.trim()
    };
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const card = link.closest('.app-card');
    if (card && link.closest('.download-links')) {
      track('app_link_click', {
        ...appDetails(card), destination_type: link.textContent.trim(), link_url: link.href
      });
    } else if (link.getAttribute('href').startsWith('#')) {
      track('navigation_click', {
        section: link.hash.slice(1),
        menu_location: link.closest('.nav') ? 'header' : link.closest('.site-footer') ? 'footer' : link.closest('.brand') ? 'brand' : 'hero'
      });
    } else if (link.closest('.contact-links')) {
      track('social_link_click', { destination_type: link.textContent.trim(), link_url: link.href });
    } else if (link.closest('.footer-brand-links')) {
      track('policy_link_click', { destination_type: link.textContent.trim(), link_url: link.href });
    } else if (link.closest('#about')) {
      track('community_link_click', { destination_type: 'K-PADA', link_url: link.href });
    }
  });

  // One impression per element per document, after one second of visible exposure.
  if (typeof IntersectionObserver !== 'function') {
    console.warn('[Analytics] Impression measurement unavailable');
    return;
  }
  const timers = new Map();
  const visible = new Set();
  const reported = new Set();
  function cancel(element) {
    clearTimeout(timers.get(element));
    timers.delete(element);
  }
  function schedule(element) {
    if (document.visibilityState !== 'visible' || timers.has(element) || reported.has(element)) return;
    timers.set(element, setTimeout(() => {
      timers.delete(element);
      if (!visible.has(element) || document.visibilityState !== 'visible') return;
      reported.add(element);
      if (element.matches('.app-card')) track('app_card_view', appDetails(element));
      else track('section_view', { section: element.id });
      observer.unobserve(element);
      visible.delete(element);
    }, 1000));
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        visible.add(entry.target);
        schedule(entry.target);
      } else {
        visible.delete(entry.target);
        cancel(entry.target);
      }
    }
  }, { threshold: [0, 0.1] });
  document.querySelectorAll('section[id], .app-card').forEach(element => observer.observe(element));
  document.addEventListener('visibilitychange', () => {
    for (const element of visible) {
      if (document.visibilityState === 'visible') schedule(element);
      else cancel(element);
    }
  });
})();
