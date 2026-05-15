/*
Credits: this script is shamelessly borrowed from
https://github.com/kitian616/jekyll-TeXt-theme
Enhanced with search and filter feedback.
*/
(function() {
  function queryString() {
    var i = 0, queryObj = {}, pair;
    var queryStr = window.location.search.substring(1);
    var queryArr = queryStr.split('&');
    for (i = 0; i < queryArr.length; i++) {
      pair = queryArr[i].split('=');
      if (typeof queryObj[pair[0]] === 'undefined') {
        queryObj[pair[0]] = pair[1];
      } else if (typeof queryObj[pair[0]] === 'string') {
        queryObj[pair[0]] = [queryObj[pair[0]], pair[1]];
      } else {
        queryObj[pair[0]].push(pair[1]);
      }
    }
    return queryObj;
  }

  var setUrlQuery = (function() {
    var baseUrl = window.location.href.split('?')[0];
    return function(query) {
      if (typeof query === 'string') {
        window.history.replaceState(null, '', baseUrl + query);
      } else {
        window.history.replaceState(null, '', baseUrl);
      }
    };
  })();

  document.addEventListener('DOMContentLoaded', function() {
    var tags = document.querySelector('.js-tags');
    if (!tags) return;
    var articleTags = tags.querySelectorAll('.tag-button');
    var tagShowAll = tags.querySelector('.tag-button--all');
    var result = document.querySelector('.js-result');
    if (!result) return;
    var sections = result.querySelectorAll('section');
    var sectionArticles = [];
    var lastFocusButton = null;
    var hasInit = false;

    // Search & filter state
    var currentTag = '';
    var currentSearch = '';
    var filterInfo = document.getElementById('archive-filter-info');
    var filterInfoText = document.getElementById('filter-info-text');
    var filterInfoClear = document.getElementById('filter-info-clear');
    var searchInput = document.getElementById('archive-search');

    sections.forEach(function(section) {
      sectionArticles.push(section.querySelectorAll('.item'));
    });

    function applyFilters() {
      var visibleCount = 0;

      for (var i = 0; i < sectionArticles.length; i++) {
        var sectionHasVisible = false;
        for (var j = 0; j < sectionArticles[i].length; j++) {
          var item = sectionArticles[i][j];
          var itemTags = item.getAttribute('data-tags') || '';
          var title = item.querySelector('.post-title');
          var titleText = title ? title.textContent.toLowerCase() : '';
          var tagArr = itemTags.split(',');

          // Check tag filter
          var tagMatch = !currentTag;
          if (!tagMatch) {
            for (var k = 0; k < tagArr.length; k++) {
              if (tagArr[k] === currentTag) { tagMatch = true; break; }
            }
          }

          // Check search filter
          var searchMatch = !currentSearch || titleText.indexOf(currentSearch.toLowerCase()) !== -1;

          if (tagMatch && searchMatch) {
            item.classList.remove('item-hidden');
            sectionHasVisible = true;
            visibleCount++;
          } else {
            item.classList.add('item-hidden');
          }
        }
        if (sectionHasVisible) {
          sections[i].classList.remove('section-hidden');
        } else {
          sections[i].classList.add('section-hidden');
        }
      }

      if (!hasInit) {
        result.classList.remove('archive-hidden');
        hasInit = true;
      }

      updateFilterInfo(visibleCount);
    }

    function updateFilterInfo(count) {
      if (!filterInfo) return;
      var parts = [];
      if (currentTag) {
        // Find tag display name
        var tagBtn = tags.querySelector('.tag-button[data-encode="' + currentTag + '"]');
        var tagName = tagBtn ? tagBtn.getAttribute('title') : currentTag;
        parts.push('标签: ' + tagName);
      }
      if (currentSearch) {
        parts.push('搜索: "' + currentSearch + '"');
      }

      if (parts.length > 0) {
        filterInfoText.textContent = '显示 ' + count + ' 篇文章 · ' + parts.join(' · ');
        filterInfo.style.display = 'flex';
      } else {
        filterInfo.style.display = 'none';
      }
    }

    function tagSelect(tag, target) {
      currentTag = (tag && tag !== '') ? tag : '';

      if (target) {
        if (lastFocusButton && lastFocusButton !== target) {
          lastFocusButton.classList.remove('focus');
        }
        target.classList.add('focus');
        lastFocusButton = target;
        if (!currentTag) {
          setUrlQuery();
        } else {
          setUrlQuery('?tag=' + currentTag);
        }
      } else {
        if (!currentTag) {
          if (tagShowAll) {
            if (lastFocusButton && lastFocusButton !== tagShowAll) lastFocusButton.classList.remove('focus');
            tagShowAll.classList.add('focus');
            lastFocusButton = tagShowAll;
          }
        } else {
          var btn = tags.querySelector('.tag-button[data-encode="' + currentTag + '"]');
          if (btn) {
            if (lastFocusButton && lastFocusButton !== btn) lastFocusButton.classList.remove('focus');
            btn.classList.add('focus');
            lastFocusButton = btn;
          }
        }
      }

      applyFilters();
    }

    // Init from URL
    var query = queryString();
    var _tag = query.tag;
    tagSelect(_tag);

    // Tag click
    tags.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (link) {
        e.preventDefault();
        tagSelect(link.getAttribute('data-encode'), link);
      }
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        currentSearch = this.value.trim();
        applyFilters();
      });
    }

    // Clear filter
    if (filterInfoClear) {
      filterInfoClear.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        currentSearch = '';
        tagSelect('');
        if (tagShowAll) {
          tagShowAll.classList.add('focus');
          lastFocusButton = tagShowAll;
        }
      });
    }
  });
})();
