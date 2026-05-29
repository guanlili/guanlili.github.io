// lili Blog — small progressive-enhancement script.
// Theme toggle · back-to-top · search overlay · responsive tables/videos · lazy images.

// ===== Unified scroll handler (single rAF loop) =====
var scrollCallbacks = [];
var scrollTicking = false;
window.addEventListener('scroll', function () {
  if (!scrollTicking) {
    window.requestAnimationFrame(function () {
      var scrollTop = window.pageYOffset;
      for (var i = 0; i < scrollCallbacks.length; i++) scrollCallbacks[i](scrollTop);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});
function onScroll(fn) { scrollCallbacks.push(fn); }

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

// ===== Search overlay (SimpleJekyllSearch over /search.json) =====
function initSearch() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  }

  if (typeof SimpleJekyllSearch !== 'undefined') {
    SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: resultsContainer,
      json: '/search.json?v=' + Date.now(),
      searchResultTemplate:
        '<a class="search-result" href="{url}"><span class="sr-t">{title}</span><span class="sr-s">{subtitle}</span></a>',
      noResultsText: '没有找到相关文章',
      limit: 50,
      fuzzy: false,
      templateMiddleware: function (prop, value) {
        if ((prop === 'subtitle' || prop === 'title') && value && value.indexOf('code') > -1) {
          return htmlDecode(value);
        }
        return value;
      }
    });
  }

  var searchPage = document.querySelector('.search-page');
  var searchOpen = document.querySelector('.search-icon');
  var searchClose = document.querySelector('.search-icon-close');
  if (!searchPage || !searchOpen) return;

  function close() {
    searchPage.classList.remove('search-active');
    document.body.classList.remove('no-scroll');
  }
  searchOpen.addEventListener('click', function (e) {
    e.preventDefault();
    var active = searchPage.classList.toggle('search-active');
    document.body.classList.toggle('no-scroll', active);
    if (active) searchInput.focus();
  });
  if (searchClose) searchClose.addEventListener('click', function (e) { e.preventDefault(); close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchPage.classList.contains('search-active')) close();
  });
}

// ===== Content enhancements =====
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

document.addEventListener('DOMContentLoaded', function () {
  initBackToTop();
  initThemeToggle();
  initSearch();
  initResponsiveTables();
  initResponsiveVideos();
  initLazyImages();
});
