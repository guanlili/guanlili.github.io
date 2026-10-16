// Web Vitals → Google Analytics reporter.
// Loads the web-vitals library from CDN and sends LCP/INP/CLS/FCP/TTFB as GA events.
// Only activates when window.GA_TRACK_ID is set (injected by BaseLayout).
(function () {
  if (!window.GA_TRACK_ID || typeof gtag !== 'function') return;
  // Client-side navigation can re-run this script; the library observers are
  // already registered for the whole session.
  if (window.__webVitalsLoaded) return;
  window.__webVitalsLoaded = true;

  function send(metric) {
    var delta = metric.delta || 0;
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? delta * 1000 : delta),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: delta,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/web-vitals@5/dist/web-vitals.iife.js';
  s.async = true;
  s.onload = function () {
    if (!window.webVitals) return;
    webVitals.onLCP(send);
    webVitals.onINP(send);
    webVitals.onCLS(send);
    webVitals.onFCP(send);
    webVitals.onTTFB(send);
  };
  document.head.appendChild(s);
})();
