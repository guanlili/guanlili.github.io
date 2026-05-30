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

// ===== Search overlay (Pagefind) =====
// Features: keyword highlight · tag filter chips · recommended articles · Ctrl+K / / shortcut
function initSearch() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  var pagefind = null;
  var loading = null;
  var seq = 0;
  var timer = null;

  // Tag filter state
  var activeTags = [];
  var availableFilters = null;

  // Recommended articles (injected at build time)
  var recommendedData = null;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  // Highlight matching query terms in text (for title rendering)
  function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    var escaped = escapeHtml(text);
    var terms = query.trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return escaped;
    var pattern = terms.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|');
    var re = new RegExp('(' + pattern + ')', 'gi');
    return escaped.replace(re, '<mark>$1</mark>');
  }

  function loadPagefind() {
    if (pagefind) return Promise.resolve(pagefind);
    if (!loading) {
      loading = import('/pagefind/pagefind.js').then(function (mod) {
        pagefind = mod;
        return pagefind;
      });
    }
    return loading;
  }

  // ── Recommended articles ──────────────────────────────────────
  function loadRecommended() {
    if (recommendedData) return;
    var script = document.getElementById('search-recommended');
    if (!script) return;
    try { recommendedData = JSON.parse(script.textContent); }
    catch (e) { recommendedData = []; }
  }

  function renderRecommendedCards(items, headerText) {
    if (!items || !items.length) return '';
    var html = '<div class="search-rec-header">' + headerText + '</div>';
    html += items.map(function (item) {
      var url = escapeHtml(item.url);
      var title = escapeHtml(item.title);
      var tags = item.tags ? item.tags.map(function (t) {
        return '<span class="sr-tag">#' + escapeHtml(t) + '</span>';
      }).join(' ') : '';
      var date = item.date || '';
      return '<a class="search-result search-rec" href="' + url + '">' +
        '<span class="sr-t">' + title + '</span>' +
        '<span class="sr-meta">' + tags +
        (date ? ' <span class="sr-date">' + date + '</span>' : '') +
        '</span></a>';
    }).join('');
    return html;
  }

  function renderRecommended() {
    loadRecommended();
    if (!recommendedData || !recommendedData.length) {
      resultsContainer.innerHTML = '<div class="search-note">输入关键词搜索文章</div>';
      return;
    }
    resultsContainer.innerHTML = renderRecommendedCards(recommendedData, '推荐阅读 / Recommended');
  }

  // ── Tag filter chips ──────────────────────────────────────────
  function loadTagFilters() {
    if (availableFilters) {
      renderTagChips(availableFilters);
      return;
    }
    loadPagefind().then(function (pf) {
      return pf.filters();
    }).then(function (filters) {
      availableFilters = filters;
      renderTagChips(filters);
    }).catch(function () {});
  }

  function renderTagChips(filters) {
    var tagContainer = document.getElementById('search-tags');
    if (!tagContainer) return;
    if (!filters || !filters.tag) {
      tagContainer.innerHTML = '';
      return;
    }
    // Sort by count descending, show top 20
    var tags = Object.keys(filters.tag).sort(function (a, b) {
      return filters.tag[b] - filters.tag[a];
    }).slice(0, 20);
    tagContainer.innerHTML = tags.map(function (tag) {
      var isActive = activeTags.indexOf(tag) !== -1;
      var count = filters.tag[tag];
      return '<button class="search-tag-chip' + (isActive ? ' active' : '') +
        '" data-tag="' + escapeHtml(tag) + '">' +
        escapeHtml(tag) + ' <span class="tag-count">' + count + '</span></button>';
    }).join('');
    tagContainer.querySelectorAll('.search-tag-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tag = btn.getAttribute('data-tag');
        var idx = activeTags.indexOf(tag);
        if (idx === -1) activeTags.push(tag);
        else activeTags.splice(idx, 1);
        renderTagChips(availableFilters);
        runSearch();
      });
    });
  }

  // ── Loading / Error / Empty states ────────────────────────────
  function renderLoading() {
    resultsContainer.innerHTML = '<div class="search-note">搜索中...</div>';
  }

  function renderError() {
    resultsContainer.innerHTML = '<div class="search-note">搜索暂时不可用</div>';
  }

  function renderEmpty(query) {
    loadRecommended();
    var html = '<div class="search-note">没有找到相关文章</div>';
    if (recommendedData && recommendedData.length) {
      html += renderRecommendedCards(recommendedData.slice(0, 4), '试试这些文章？');
    }
    resultsContainer.innerHTML = html;
  }

  // ── Core search ───────────────────────────────────────────────
  function runSearch() {
    var query = searchInput.value.trim();
    var current = ++seq;
    if (!query && !activeTags.length) {
      renderRecommended();
      return;
    }

    renderLoading();
    loadPagefind().then(function (pf) {
      var options = {};
      if (activeTags.length) {
        options.filters = { tag: activeTags };
      }
      return pf.search(query || null, options);
    }).then(function (search) {
      if (current !== seq) return;
      var results = (search.results || []).slice(0, 50);
      if (!results.length) {
        renderEmpty(query);
        return;
      }
      return Promise.all(results.map(function (r) { return r.data(); })).then(function (items) {
        if (current !== seq) return;
        resultsContainer.innerHTML = items.map(function (item) {
          var rawTitle = (item.meta && item.meta.title) ? item.meta.title : item.url;
          var title = highlightText(rawTitle, query);
          var excerpt = item.excerpt || '';
          var url = escapeHtml(item.url);
          return '<a class="search-result" href="' + url + '">' +
            '<span class="sr-t">' + title + '</span>' +
            '<span class="sr-e">' + excerpt + '</span>' +
            '</a>';
        }).join('');
      });
    }).catch(function () {
      if (current === seq) renderError();
    });
  }

  // Debounced input
  searchInput.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(runSearch, 180);
  });

  // ── Overlay open / close ──────────────────────────────────────
  var searchPage = document.querySelector('.search-page');
  var searchOpen = document.querySelector('.search-icon');
  var searchClose = document.querySelector('.search-icon-close');
  if (!searchPage || !searchOpen) return;

  function openSearch() {
    searchPage.classList.add('search-active');
    document.body.classList.add('no-scroll');
    searchInput.focus();
    loadTagFilters();
    if (!searchInput.value.trim() && !activeTags.length) renderRecommended();
  }

  function close() {
    searchPage.classList.remove('search-active');
    document.body.classList.remove('no-scroll');
    activeTags = [];
    if (availableFilters) renderTagChips(availableFilters);
  }

  searchOpen.addEventListener('click', function (e) {
    e.preventDefault();
    openSearch();
  });
  if (searchClose) searchClose.addEventListener('click', function (e) { e.preventDefault(); close(); });

  // Keyboard shortcuts: Escape / Ctrl+K / /
  document.addEventListener('keydown', function (e) {
    // Escape closes overlay
    if (e.key === 'Escape' && searchPage.classList.contains('search-active')) {
      close();
      return;
    }
    // Ctrl+K or Cmd+K opens overlay
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchPage.classList.contains('search-active')) {
        searchInput.focus();
        searchInput.select();
      } else {
        openSearch();
      }
      return;
    }
    // "/" opens overlay (not when typing in inputs)
    if (e.key === '/') {
      var tag = document.activeElement ? document.activeElement.tagName : '';
      var editable = document.activeElement && document.activeElement.isContentEditable;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !editable) {
        e.preventDefault();
        openSearch();
      }
    }
  });
}

// ===== TOC: scroll highlight · h3 collapse · mobile sheet =====
function initTOC() {
  var desktopNav = document.querySelector('.article-body > .toc');
  var sheet = document.querySelector('.toc-sheet');
  var fab = document.querySelector('.toc-fab');
  if (!desktopNav && !sheet) return;

  var desktopItems = desktopNav ? desktopNav.querySelectorAll('li') : [];
  var sheetItems = sheet ? sheet.querySelectorAll('li') : [];

  // ── Scroll highlight (IntersectionObserver) ──────────────────
  var headings = document.querySelectorAll('.article-content h2, .article-content h3');
  if (headings.length) {
    var currentSlug = null;

    function setActive(slug) {
      if (slug === currentSlug) return;
      currentSlug = slug;
      desktopItems.forEach(function (li) {
        var a = li.querySelector('a');
        li.classList.toggle('toc-active', a && a.getAttribute('href') === '#' + slug);
      });
      sheetItems.forEach(function (li) {
        var a = li.querySelector('a');
        li.classList.toggle('toc-active', a && a.getAttribute('href') === '#' + slug);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-80px 0px -66% 0px',
      threshold: 0
    });
    headings.forEach(function (h) { if (h.id) observer.observe(h); });
  }

  // ── H3 collapse for long TOCs (desktop) ─────────────────────
  if (desktopNav && desktopItems.length > 10) {
    var h2Items = [];
    // Group h3s under their preceding h2
    desktopItems.forEach(function (li) {
      if (li.getAttribute('data-depth') === '2') {
        h2Items.push({ el: li, children: [] });
      } else if (h2Items.length) {
        h2Items[h2Items.length - 1].children.push(li);
      }
    });

    h2Items.forEach(function (group) {
      if (group.children.length <= 1) return; // don't collapse single h3
      var link = group.el.querySelector('a');
      if (!link) return;

      // Start collapsed
      group.children.forEach(function (c) { c.style.display = 'none'; });
      group.el.classList.add('toc-collapsed');

      // Add toggle
      var toggle = document.createElement('span');
      toggle.className = 'toc-toggle';
      toggle.textContent = '+';
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-label', '展开子标题');
      link.parentNode.insertBefore(toggle, link.nextSibling);

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var collapsed = group.el.classList.contains('toc-collapsed');
        group.children.forEach(function (c) { c.style.display = collapsed ? '' : 'none'; });
        group.el.classList.toggle('toc-collapsed', !collapsed);
        group.el.classList.toggle('toc-expanded', collapsed);
        toggle.textContent = collapsed ? '−' : '+';
      });
    });
  }

  // ── Mobile: FAB → bottom sheet ───────────────────────────────
  if (fab && sheet) {
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'toc-sheet-backdrop';
    sheet.parentNode.insertBefore(backdrop, sheet);

    function openSheet() {
      sheet.classList.add('toc-sheet-open');
      sheet.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('open');
    }
    function closeSheet() {
      sheet.classList.remove('toc-sheet-open');
      sheet.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('open');
    }

    fab.addEventListener('click', openSheet);
    backdrop.addEventListener('click', closeSheet);
    sheet.querySelector('.toc-sheet-close').addEventListener('click', closeSheet);

    // Click a link in sheet → close sheet
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeSheet(); });
    });

    // Escape closes sheet
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('toc-sheet-open')) closeSheet();
    });
  }
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

// Render ```mermaid blocks as diagrams. Mermaid is excluded from Shiki
// (astro.config), so it arrives as <pre><code class="language-mermaid">.
// Loaded from CDN only when a diagram exists; degrades to the code block on failure.
function initMermaid() {
  var codes = document.querySelectorAll('pre > code.language-mermaid');
  if (!codes.length) return;
  var dark = document.documentElement.getAttribute('data-theme') === 'dark';
  import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')
    .then(function (mod) {
      var mermaid = mod.default;
      mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'loose' });
      var nodes = [];
      codes.forEach(function (code) {
        var div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent;
        code.parentElement.replaceWith(div);
        nodes.push(div);
      });
      mermaid.run({ nodes: nodes }).catch(function () {});
    })
    .catch(function () { /* CDN unavailable: leave the code block visible */ });
}

document.addEventListener('DOMContentLoaded', function () {
  initBackToTop();
  initThemeToggle();
  initSearch();
  initTOC();
  initResponsiveTables();
  initResponsiveVideos();
  initLazyImages();
  initMermaid();
});
