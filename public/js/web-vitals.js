// Web Vitals → Google Analytics reporter.
// Loads the web-vitals library from CDN and sends LCP/FID/CLS/INP/TTFB as GA events.
// Only activates when window.GA_TRACK_ID is set (injected by BaseLayout).
(function () {
  if (!window.GA_TRACK_ID || typeof gtag !== 'function') return;

  function send(metric) {
    var delta = metric.delta || 0;
    // Round delta to nearest int for cleaner GA reports.
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? delta * 1000 : delta),
      metric_id: metric.id,
      metric_value: Math.round(metric.value),
      metric_delta: Math.round(delta),
      non_interaction: true,
    });
  }

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/web-vitals@4/dist/web-vitals.iife.js';
  s.onload = function () {
    if (window.webVitals) {
      webVitals.onLCP(send);
      webVitals.onFID(send);
      webVitals.onCLS(send);
      webVitals.onINP(send);
      webVitals.onTTFB(send);
    }
  };
  document.head.appendChild(s);
})();
