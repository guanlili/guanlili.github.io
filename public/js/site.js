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
// Re-apply the saved theme. View Transitions swap in the new page's <html>
// element, which has no data-theme, so the attribute must be restored on swap.
function applyStoredTheme() {
  var saved = localStorage.getItem('theme');
  var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var html = document.documentElement;
  if (dark) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
  }
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#15130e' : '#f1ede3');
}

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

// ===== Mobile nav (hamburger dropdown) =====
function initNavToggle() {
  var btn = document.getElementById('nav-toggle-btn');
  var bar = document.querySelector('.topbar');
  var icon = document.getElementById('nav-toggle-icon');
  if (!btn || !bar) return;

  function setOpen(open) {
    bar.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (icon) icon.innerHTML = '<use href="#icon-' + (open ? 'x' : 'menu') + '"></use>';
  }
  btn.addEventListener('click', function () {
    setOpen(!bar.classList.contains('nav-open'));
  });
  // Dismiss on link tap or Escape.
  bar.querySelectorAll('#primary-nav a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bar.classList.contains('nav-open')) setOpen(false);
  });
}

// ===== Image lightbox (global) =====
// Click a zoomable image to view it full-screen. Covers the article body,
// the About long-form, and the About QR banners (微信公众号 / 小红书).
function initLightbox() {
  var overlay = null;

  function open(src, alt) {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'img-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', '图片放大');
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    overlay.offsetHeight;
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    var el = overlay;
    setTimeout(function () { el.remove(); }, 260);
    overlay = null;
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('click', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    if (img.closest('.img-lightbox')) return;            // ignore the overlay itself
    if (!img.closest('.article-content, .long-form, .channel-hero')) return;
    if (img.getAttribute('fetchpriority')) return;        // skip the eager cover
    if (img.closest('a')) return;                         // skip linked images
    e.preventDefault();
    open(img.currentSrc || img.src, img.alt);
  });

  document.addEventListener('click', function (e) {
    if (overlay && e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay) close();
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

// ===== Tools stack filters =====
function initToolsStack() {
  var root = document.querySelector('.tools-console');
  if (!root || root.dataset.toolsStackReady === 'true') return;
  root.dataset.toolsStackReady = 'true';

  var input = document.getElementById('tools-search-input');
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var tagFilters = Array.prototype.slice.call(document.querySelectorAll('[data-tag-filter]'));
  var viewButtons = Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tool-card]'));
  var pinnedCards = Array.prototype.slice.call(document.querySelectorAll('[data-pinned-card]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-stage-section]'));
  var pinnedSection = document.querySelector('[data-pinned-section]');
  var workspace = document.querySelector('[data-tools-workspace]');
  var summary = document.querySelector('[data-tools-summary]');
  var empty = document.querySelector('[data-tools-empty]');
  var activeButton = document.querySelector('[data-filter].active');
  var currentStage = activeButton ? activeButton.getAttribute('data-filter') || 'all' : 'all';
  var activeTagButton = document.querySelector('[data-tag-filter].active');
  var currentTag = activeTagButton ? activeTagButton.getAttribute('data-tag-filter') || 'all' : 'all';
  var pinnedLimit = 9;
  var storageKey = 'lili-tools-clicks';

  function isVisibleTool(el) {
    return !el.hidden;
  }

  function readClicks() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeClicks(clicks) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(clicks));
    } catch (e) {}
  }

  function clickScore(card, clicks) {
    return Number(clicks[card.dataset.toolKey || ''] || 0);
  }

  function updatePinnedRanking() {
    var clicks = readClicks();
    var visiblePinned = pinnedCards.filter(isVisibleTool);
    visiblePinned.sort(function (a, b) {
      var scoreDiff = clickScore(b, clicks) - clickScore(a, clicks);
      if (scoreDiff) return scoreDiff;
      var pinnedDiff = (b.dataset.defaultPinned === 'true' ? 1 : 0) - (a.dataset.defaultPinned === 'true' ? 1 : 0);
      if (pinnedDiff) return pinnedDiff;
      return Number(a.dataset.defaultRank || 0) - Number(b.dataset.defaultRank || 0);
    });

    pinnedCards.forEach(function (card) {
      card.style.order = '';
    });
    visiblePinned.forEach(function (card, index) {
      card.style.order = String(index);
      if (index >= pinnedLimit) card.hidden = true;
    });
  }

  function applyFilter() {
    var query = input ? input.value.trim().toLowerCase() : '';
    var visibleKeys = {};
    var visibleCount = 0;

    cards.forEach(function (card) {
      var stageMatch = currentStage === 'all' || card.dataset.stage === currentStage;
      var textMatch = !query || (card.dataset.search || '').indexOf(query) >= 0;
      var tags = (card.dataset.tags || '').toLowerCase();
      var tagMatch = currentTag === 'all' || tags.split('|').indexOf(currentTag.toLowerCase()) !== -1;
      var visible = stageMatch && textMatch && tagMatch;
      card.hidden = !visible;
      if (visible && card.dataset.toolKey) visibleKeys[card.dataset.toolKey] = true;
    });

    updatePinnedRanking();

    sections.forEach(function (section) {
      var visibleRows = Array.prototype.slice.call(section.querySelectorAll('[data-tool-card]')).filter(isVisibleTool).length;
      var stageMatch = currentStage === 'all' || section.dataset.stageSection === currentStage;
      section.hidden = !stageMatch || visibleRows === 0;
    });

    if (pinnedSection) {
      var visiblePinned = Array.prototype.slice.call(pinnedSection.querySelectorAll('[data-tool-card]')).filter(isVisibleTool).length;
      pinnedSection.hidden = visiblePinned === 0;
    }

    visibleCount = Object.keys(visibleKeys).length;
    if (summary) {
      var stageLabel = currentStage === 'all' ? '全部阶段' : currentStage;
      var tagLabel = currentTag === 'all' ? '全部标签' : currentTag;
      summary.textContent = visibleCount + ' tools · ' + stageLabel + ' · ' + tagLabel;
    }
    if (empty) empty.hidden = visibleCount > 0;
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      currentStage = button.dataset.filter || 'all';
      filters.forEach(function (item) { item.classList.toggle('active', item === button); });
      applyFilter();

      var target = button.getAttribute('data-stage-target');
      if (target && currentStage !== 'all') {
        var el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  tagFilters.forEach(function (button) {
    button.addEventListener('click', function () {
      currentTag = button.dataset.tagFilter || 'all';
      tagFilters.forEach(function (item) { item.classList.toggle('active', item === button); });
      applyFilter();
    });
  });

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var view = button.dataset.view || 'balanced';
      viewButtons.forEach(function (item) { item.classList.toggle('active', item === button); });
      if (workspace) workspace.dataset.view = view;
    });
  });

  if (input) input.addEventListener('input', applyFilter);
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var key = card.dataset.toolKey;
      if (!key) return;
      var clicks = readClicks();
      clicks[key] = Number(clicks[key] || 0) + 1;
      writeClicks(clicks);
    });
  });
  applyFilter();
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

// Search engines and shared links use /?q=keyword (the same URL advertised
// by the SearchAction JSON-LD). Open the overlay and hydrate that query.
function initSearchFromUrl() {
  var query = new URLSearchParams(window.location.search).get('q');
  if (query && query.trim()) loadSearch();
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

// ===== Init core (View Transitions compatible) =====
var _pageInited = false;
function initPage() {
  initToolsStack();
  initSearchFromUrl();
  if (_pageInited) return;
  _pageInited = true;
  initBackToTop();
  initThemeToggle();
  initNavToggle();
  initLightbox();
  initResponsiveTables();
  initResponsiveVideos();
  initLazyImages();
}

document.addEventListener('astro:after-swap', function () {
  applyStoredTheme();
  _pageInited = false;
  window._scrollCallbacks = [];
  window._scrollTicking = false;
  searchLoaded = false;
  searchQueue = null;
});

document.addEventListener('astro:page-load', initPage);
document.addEventListener('DOMContentLoaded', initPage);
