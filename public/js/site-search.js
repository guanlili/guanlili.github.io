// lili Blog — search overlay module.
// Loaded on demand when user triggers search (⌘K, /, or click).
// Features: keyword highlight · tag filter chips · recommended articles.

export function initSearch() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  var searchPage = document.querySelector('.search-page');
  var searchClose = document.querySelector('.search-icon-close');
  if (!searchInput || !resultsContainer || !searchPage) return;

  var pagefind = null;
  var loading = null;
  var seq = 0;
  var timer = null;

  // Tag filter state
  var activeTags = [];
  var availableFilters = null;

  // Recommended articles (injected at build time)
  var recommendedData = null;
  var catalogByUrl = null;
  var catalogLoading = null;

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

  function normalizeUrl(url) {
    var value = String(url || '');
    try {
      value = new URL(value, window.location.origin).pathname;
    } catch (e) {}
    if (!value.startsWith('/')) value = '/' + value;
    return value.endsWith('/') ? value : value + '/';
  }

  function loadCatalog() {
    if (catalogByUrl) return Promise.resolve(catalogByUrl);
    if (!catalogLoading) {
      catalogLoading = fetch('/search-catalog.json', { credentials: 'same-origin' })
        .then(function (res) {
          if (!res.ok) throw new Error('catalog unavailable');
          return res.json();
        })
        .then(function (items) {
          catalogByUrl = {};
          (items || []).forEach(function (item) {
            catalogByUrl[normalizeUrl(item.url)] = item;
          });
          return catalogByUrl;
        })
        .catch(function () {
          catalogByUrl = {};
          return catalogByUrl;
        });
    }
    return catalogLoading;
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

  function renderEmpty() {
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
        renderEmpty();
        return;
      }
      return Promise.all([
        Promise.all(results.map(function (r) { return r.data(); })),
        loadCatalog()
      ]).then(function (loaded) {
        if (current !== seq) return;
        var items = loaded[0];
        var catalog = loaded[1];
        resultsContainer.innerHTML = items.map(function (item) {
          var meta = catalog[normalizeUrl(item.url)] || {};
          var rawTitle = (item.meta && item.meta.title) ? item.meta.title : item.url;
          var title = highlightText(rawTitle, query);
          var excerpt = item.excerpt || '';
          var url = escapeHtml(item.url);
          var tags = meta.tags ? meta.tags.map(function (t) {
            return '<span class="sr-tag">#' + escapeHtml(t) + '</span>';
          }).join(' ') : '';
          var metaHtml = (meta.date || tags) ?
            '<span class="sr-meta">' +
              (meta.date ? '<span class="sr-date">' + escapeHtml(meta.date) + '</span>' : '') +
              tags +
            '</span>' : '';
          return '<a class="search-result" href="' + url + '">' +
            '<span class="sr-t">' + title + '</span>' +
            metaHtml +
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
  function openSearch() {
    searchPage.classList.add('search-active');
    document.body.classList.add('no-scroll');
    searchInput.focus();
    loadTagFilters();
    if (!searchInput.value.trim() && !activeTags.length) renderRecommended();
    else runSearch();
  }

  function close() {
    searchPage.classList.remove('search-active');
    document.body.classList.remove('no-scroll');
    activeTags = [];
    if (availableFilters) renderTagChips(availableFilters);
  }

  if (searchClose) searchClose.addEventListener('click', function (e) { e.preventDefault(); close(); });

  // Escape closes overlay
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchPage.classList.contains('search-active')) {
      close();
    }
  });

  // Open now (search was triggered by user action before module loaded)
  openSearch();
}
