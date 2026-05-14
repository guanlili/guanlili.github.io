/*
Credits: this script is shamelessly borrowed from
https://github.com/kitian616/jekyll-TeXt-theme
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
    var sectionTopArticleIndex = [];
    var hasInit = false;

    sections.forEach(function(section) {
      sectionArticles.push(section.querySelectorAll('.item'));
    });

    function init() {
      var index = 0;
      for (var i = 0; i < sections.length; i++) {
        sectionTopArticleIndex.push(index);
        index += sections[i].querySelectorAll('.item').length;
      }
      sectionTopArticleIndex.push(index);
    }

    function searchButtonsByTag(_tag) {
      if (!_tag) return tagShowAll;
      var buttons = tags.querySelectorAll('.tag-button[data-encode="' + _tag + '"]');
      return buttons.length === 0 ? tagShowAll : buttons[0];
    }

    function buttonFocus(target) {
      if (target) {
        target.classList.add('focus');
        if (lastFocusButton && lastFocusButton !== target) {
          lastFocusButton.classList.remove('focus');
        }
        lastFocusButton = target;
      }
    }

    function tagSelect(tag, target) {
      var resultMap = {};
      var i, j, k;

      for (i = 0; i < sectionArticles.length; i++) {
        for (j = 0; j < sectionArticles[i].length; j++) {
          if (tag === '' || tag === undefined) {
            resultMap[i] || (resultMap[i] = {});
            resultMap[i][j] = true;
          } else {
            var itemTags = sectionArticles[i][j].getAttribute('data-tags');
            if (itemTags) {
              var tagArr = itemTags.split(',');
              for (k = 0; k < tagArr.length; k++) {
                if (tagArr[k] === tag) {
                  resultMap[i] || (resultMap[i] = {});
                  resultMap[i][j] = true;
                  break;
                }
              }
            }
          }
        }
      }

      for (i = 0; i < sectionArticles.length; i++) {
        if (resultMap[i]) {
          sections[i].classList.remove('d-none');
        } else {
          sections[i].classList.add('d-none');
        }
        for (j = 0; j < sectionArticles[i].length; j++) {
          if (resultMap[i] && resultMap[i][j]) {
            sectionArticles[i][j].classList.remove('d-none');
          } else {
            sectionArticles[i][j].classList.add('d-none');
          }
        }
      }

      if (!hasInit) {
        result.classList.remove('d-none');
        hasInit = true;
      }

      if (target) {
        buttonFocus(target);
        var _tag = target.getAttribute('data-encode');
        if (!_tag || _tag === '') {
          setUrlQuery();
        } else {
          setUrlQuery('?tag=' + _tag);
        }
      } else {
        buttonFocus(searchButtonsByTag(tag));
      }
    }

    var query = queryString();
    var _tag = query.tag;

    init();
    tagSelect(_tag);

    tags.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (link) {
        tagSelect(link.getAttribute('data-encode'), link);
      }
    });
  });
})();
