// lili Blog — core script (all pages).
// Theme toggle · back-to-top · responsive tables/videos · lazy images.
// Article features (TOC/lightbox/code/mermaid/progress) and search load on demand.

// ===== Unified scroll handler (single rAF loop) =====
if (!window._scrollCallbacks) {
  window._scrollCallbacks = [];
  window._scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!window._scrollTicking) {
      window.requestAnimationFrame(function () {
        var scrollTop = window.pageYOffset;
        for (var i = 0; i < window._scrollCallbacks.length; i++) window._scrollCallbacks[i](scrollTop);
        window._scrollTicking = false;
      });
      window._scrollTicking = true;
    }
  });
}
function onScroll(fn) { window._scrollCallbacks.push(fn); }

// ===== Back to top =====
function initBackToTop() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  onScroll(function (scrollTop) {
    btn.classList.toggle('show', scrollTop > 400);
  });
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Light / dark theme toggle =====
function initThemeToggle() {
  var btn = document.getElementById('theme-toggle-btn');
  var iconSvg = document.getElementById('theme-icon-svg');
  if (!btn || !iconSvg) return;

  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    iconSvg.innerHTML = '<use href="#icon-sun"></use>';
  }
  btn.addEventListener('click', function () {
    var html = document.documentElement;
    var dark = html.getAttribute('data-theme') !== 'dark';
    if (dark) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      iconSvg.innerHTML = '<use href="#icon-sun"></use>';
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      iconSvg.innerHTML = '<use href="#icon-moon"></use>';
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#15130e' : '#f1ede3');
  });
}

// ===== Content enhancements (lightweight) =====
function initResponsiveTables() {
  document.querySelectorAll('.article-content table, .long-form table').forEach(function (table) {
    if (table.parentNode.classList.contains('table-responsive')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    table.classList.add('table');
  });
}

function initResponsiveVideos() {
  document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="bilibili.com"], iframe[src*="vimeo.com"]').forEach(function (iframe) {
    var wrapper = document.createElement('div');
    wrapper.className = 'embed-responsive embed-responsive-16by9';
    iframe.parentNode.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
    iframe.classList.add('embed-responsive-item');
  });
}

function initLazyImages() {
  document.querySelectorAll('.article-content img:not([loading]), .long-form img:not([loading])').forEach(function (img) {
    img.setAttribute('loading', 'lazy');
  });
}

// ===== Search overlay — loads on first interaction =====
var searchLoaded = false;
var searchQueue = null;

function loadSearch() {
  if (searchLoaded) return Promise.resolve();
  if (searchQueue) return searchQueue;
  searchQueue = import('/js/site-search.js').then(function (mod) {
    mod.initSearch();
    searchLoaded = true;
  }).catch(function () {});
  return searchQueue;
}

// Preload search module on ⌘K hover/focus (lightweight hint)
document.querySelector('.search-icon')?.addEventListener('mouseenter', function () {
  if (!searchLoaded) loadSearch();
}, { once: true });

// Keyboard shortcuts: wired immediately (lightweight)
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    loadSearch();
  }
  if (e.key === '/') {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    var editable = document.activeElement && document.activeElement.isContentEditable;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !editable) {
      e.preventDefault();
      loadSearch();
    }
  }
});

// Click handler delegates to search module once loaded
document.querySelector('.search-icon')?.addEventListener('click', function (e) {
  e.preventDefault();
  loadSearch();
});

// ===== Init core =====
document.addEventListener('DOMContentLoaded', function () {
  initBackToTop();
  initThemeToggle();
  initResponsiveTables();
  initResponsiveVideos();
  initLazyImages();
});
