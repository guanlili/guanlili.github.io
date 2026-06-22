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
  var catalogItems = [];
  var catalogLoading = null;
  var quickSearches = ['Dify', 'RAG', 'PDF解析', '本地部署', '代码生成', 'ComfyUI'];

  function syncSearchQuery(query) {
    var url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

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

  function normalizedText(value) {
    return String(value || '').toLowerCase();
  }

  function searchTerms(query) {
    return normalizedText(query).split(/\s+/).filter(Boolean);
  }

  function includesAny(value, terms) {
    var text = normalizedText(value);
    return terms.some(function (term) {
      return text.indexOf(term) !== -1;
    });
  }

  function scoreSearchItem(item, query, excerpt, originalIndex) {
    var terms = searchTerms(query);
    var exact = normalizedText(query);
    var title = normalizedText(item.title);
    var tags = normalizedText((item.tags || []).join(' '));
    var search = normalizedText(item.search || '');
    var body = normalizedText(excerpt || '');
    var score = Math.max(0, 50 - originalIndex);

    if (exact && title.indexOf(exact) !== -1) score += 140;
    if (exact && tags.indexOf(exact) !== -1) score += 90;
    if (exact && search.indexOf(exact) !== -1) score += 45;

    terms.forEach(function (term) {
      if (title.indexOf(term) !== -1) score += 55;
      if (tags.indexOf(term) !== -1) score += 35;
      if (search.indexOf(term) !== -1) score += 18;
      if (body.indexOf(term) !== -1) score += 4;
    });

    activeTags.forEach(function (tag) {
      if ((item.tags || []).indexOf(tag) !== -1) score += 25;
    });

    return score;
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
          catalogItems = items || [];
          catalogItems.forEach(function (item) {
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

  // ── Quick searches ────────────────────────────────────────────
  function renderQuickSearches() {
    var quickContainer = document.getElementById('search-quick');
    if (!quickContainer) return;
    quickContainer.innerHTML = quickSearches.map(function (label) {
      return '<button class="search-quick-chip" data-query="' + escapeHtml(label) + '">' +
        escapeHtml(label) + '</button>';
    }).join('');
    quickContainer.querySelectorAll('.search-quick-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var query = btn.getAttribute('data-query') || '';
        searchInput.value = query;
        runSearch();
        searchInput.focus();
      });
    });
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

  function hitKind(meta, query, excerpt, rawTitle) {
    var terms = searchTerms(query);
    if (!terms.length) return { label: '筛选结果', className: 'filter' };

    var tags = (meta.tags || []).join(' ');
    var aliases = (meta.aliases || []).join(' ');
    if (includesAny(rawTitle, terms)) return { label: '标题命中', className: 'title' };
    if (includesAny(tags, terms)) return { label: '标签命中', className: 'tag' };
    if (includesAny(aliases, terms)) return { label: '别名命中', className: 'alias' };
    if (meta.url && includesAny(meta.search || '', terms)) return { label: '资料命中', className: 'meta' };
    if (includesAny(excerpt || '', terms)) return { label: '正文命中', className: 'body' };
    return meta.url ? { label: '相关结果', className: 'related' } : { label: '页面结果', className: 'page' };
  }

  // ── Core search ───────────────────────────────────────────────
  function runSearch() {
    var query = searchInput.value.trim();
    var current = ++seq;
    syncSearchQuery(query);
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
        Promise.all(results.map(function (r, i) {
          return r.data().then(function (item) {
            return { item: item, pagefindRank: i };
          });
        })),
        loadCatalog()
      ]).then(function (loaded) {
        if (current !== seq) return;
        var loadedItems = loaded[0];
        var catalog = loaded[1];
        var byUrl = {};
        var merged = loadedItems.map(function (entry) {
          var item = entry.item;
          var normalized = normalizeUrl(item.url);
          var meta = catalog[normalized] || {};
          var enriched = { item: item, meta: meta, pagefindRank: entry.pagefindRank };
          byUrl[normalized] = enriched;
          return enriched;
        });

        // Blend in catalog-only matches for tag aliases and metadata phrases.
        if (query) {
          catalogItems.forEach(function (meta, i) {
            var normalized = normalizeUrl(meta.url);
            if (byUrl[normalized]) return;
            var score = scoreSearchItem(meta, query, '', 500 + i);
            if (score > 0 && searchTerms(query).some(function (term) {
              return normalizedText(meta.search).indexOf(term) !== -1;
            })) {
              var fallback = {
                item: { url: meta.url, meta: { title: meta.title }, excerpt: '' },
                meta: meta,
                pagefindRank: 500 + i,
              };
              byUrl[normalized] = fallback;
              merged.push(fallback);
            }
          });
        }

        merged.sort(function (a, b) {
          var aTitle = (a.item.meta && a.item.meta.title) ? a.item.meta.title : a.meta.title;
          var bTitle = (b.item.meta && b.item.meta.title) ? b.item.meta.title : b.meta.title;
          var aScore = scoreSearchItem({ ...a.meta, title: aTitle }, query, a.item.excerpt, a.pagefindRank);
          var bScore = scoreSearchItem({ ...b.meta, title: bTitle }, query, b.item.excerpt, b.pagefindRank);
          if (!a.meta.url) aScore -= 80;
          if (!b.meta.url) bScore -= 80;
          return bScore - aScore;
        });

        resultsContainer.innerHTML = merged.slice(0, 50).map(function (entry) {
          var item = entry.item;
          var meta = entry.meta || {};
          var rawTitle = (item.meta && item.meta.title) ? item.meta.title : item.url;
          var title = highlightText(rawTitle, query);
          var excerpt = item.excerpt || '';
          var url = escapeHtml(item.url);
          var hit = hitKind(meta, query, excerpt, rawTitle);
          var tags = meta.tags ? meta.tags.map(function (t) {
            return '<span class="sr-tag">#' + escapeHtml(t) + '</span>';
          }).join(' ') : '';
          var hitHtml = '<span class="sr-hit ' + escapeHtml(hit.className) + '">' + escapeHtml(hit.label) + '</span>';
          var metaHtml = (meta.date || tags || hitHtml) ?
            '<span class="sr-meta">' +
              hitHtml +
              (meta.date ? '<span class="sr-date">' + escapeHtml(meta.date) + '</span>' : '') +
              tags +
            '</span>' : '';
          return '<a class="search-result' + (meta.url ? '' : ' page-result') + '" href="' + url + '">' +
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
  // Element to restore focus to when the overlay closes (the trigger).
  var lastFocused = null;

  // Make everything except the overlay inert while it is open. `inert` removes
  // those subtrees from the tab order and the accessibility tree, which both
  // traps focus inside the dialog and hides the background from screen readers.
  function setBackgroundInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === searchPage) return;
      if (on) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }

  function openSearch() {
    if (searchPage.classList.contains('search-active')) { searchInput.focus(); return; }
    lastFocused = document.activeElement;
    searchPage.removeAttribute('inert');
    setBackgroundInert(true);
    searchPage.classList.add('search-active');
    document.body.classList.add('no-scroll');
    searchInput.focus();
    renderQuickSearches();
    loadTagFilters();
    if (!searchInput.value.trim() && !activeTags.length) renderRecommended();
    else runSearch();
  }

  function close() {
    searchPage.classList.remove('search-active');
    document.body.classList.remove('no-scroll');
    searchPage.setAttribute('inert', '');
    setBackgroundInert(false);
    activeTags = [];
    if (availableFilters) renderTagChips(availableFilters);
    // Return focus to whatever opened the overlay (keyboard users).
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) { /* element gone */ }
    }
  }

  // Expose so site.js can reopen after the module has loaded once.
  window.__liliOpenSearch = openSearch;

  if (searchClose) searchClose.addEventListener('click', function (e) { e.preventDefault(); close(); });

  // Escape closes overlay
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchPage.classList.contains('search-active')) {
      close();
    }
  });

  // Open now (search was triggered by user action before module loaded).
  // Preserve a query from a shared /?q= link before opening the overlay.
  var initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery && initialQuery.trim()) searchInput.value = initialQuery.trim();
  openSearch();
}
