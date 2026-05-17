/*!
 * Hux Blog v1.8.2 (http://huxpro.github.io)
 * Copyright 2026 Hux <huxpro@gmail.com>
 * Licensed under Apache 2.0
 */

// ===== Snackbar =====
var createSnackbar = (function() {
  var previous = null;
  return function(config) {
    var message = config.message,
      actionText = config.actionText,
      action = config.action,
      duration = config.duration;
    if (previous) { previous.dismiss(); }
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    snackbar.dismiss = function() { this.style.opacity = 0; };
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    if (actionText) {
      if (!action) { action = snackbar.dismiss.bind(snackbar); }
      var actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.innerHTML = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    setTimeout(function() {
      if (previous === this) { previous.dismiss(); }
    }.bind(snackbar), duration || 5000);
    snackbar.addEventListener('transitionend', function(event) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
        if (previous === this) { previous = null; }
      }
    }.bind(snackbar));
    previous = snackbar;
    document.body.appendChild(snackbar);
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();

// ===== Service Worker Registration =====
(function() {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      registration.onupdatefound = function() {
        var installingWorker = registration.installing;
        installingWorker.onstatechange = function() {
          if (installingWorker.state !== 'installed') return;
          if (!navigator.serviceWorker.controller) {
            createSnackbar({ message: 'App ready for offline use.', duration: 3000 });
          }
        };
      };
    }).catch(function() {});
  navigator.serviceWorker.onmessage = function(e) {
    if (e.data && e.data.command === 'UPDATE_FOUND') {
      createSnackbar({ message: 'Content updated.', actionText: 'refresh', action: function() { location.reload(); } });
    }
  };
})();

// ===== Unified scroll handler (single rAF loop) =====
var scrollCallbacks = [];
var scrollTicking = false;

window.addEventListener('scroll', function() {
  if (!scrollTicking) {
    window.requestAnimationFrame(function() {
      var scrollTop = window.pageYOffset;
      for (var i = 0; i < scrollCallbacks.length; i++) {
        scrollCallbacks[i](scrollTop);
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

function onScroll(fn) {
  scrollCallbacks.push(fn);
}

// ===== Init functions =====

function initResponsiveTables() {
  document.querySelectorAll('table').forEach(function(table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    table.classList.add('table');
  });
}

function initResponsiveVideos() {
  document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').forEach(function(iframe) {
    var wrapper = document.createElement('div');
    wrapper.className = 'embed-responsive embed-responsive-16by9';
    iframe.parentNode.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
    iframe.classList.add('embed-responsive-item');
  });
}

function initNavbar() {
  var MQL = 1170;
  if (window.innerWidth <= MQL) return;

  var navbar = document.querySelector('.navbar-custom');
  var banner = document.querySelector('.intro-header .container');
  if (!navbar || !banner) return;

  var headerHeight = navbar.offsetHeight;
  var bannerHeight = banner.offsetHeight;
  var previousTop = 0;

  onScroll(function(scrollTop) {
    if (scrollTop < previousTop) {
      if (scrollTop > 0 && navbar.classList.contains('is-fixed')) {
        navbar.classList.add('is-visible');
      } else {
        navbar.classList.remove('is-visible', 'is-fixed');
      }
    } else {
      navbar.classList.remove('is-visible');
      if (scrollTop > headerHeight && !navbar.classList.contains('is-fixed')) {
        navbar.classList.add('is-fixed');
      }
    }
    previousTop = scrollTop;

    var catalog = document.querySelector('.side-catalog');
    if (catalog) {
      catalog.style.display = '';
      if (scrollTop > (bannerHeight + 41)) {
        catalog.classList.add('fixed');
      } else {
        catalog.classList.remove('fixed');
      }
    }
  });
}

function initProgressBar() {
  var progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  onScroll(function(scrollTop) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  });
}

function initBackToTop() {
  var backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  onScroll(function(scrollTop) {
    if (scrollTop > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCodeCopy() {
  if (!document.querySelector('.highlighter-rouge')) return;

  document.querySelectorAll('.post-container .highlighter-rouge').forEach(function(block) {
    var code = block.querySelector('pre:last-child');
    if (!code) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = '复制';
    block.style.position = 'relative';
    block.appendChild(btn);

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var text = code.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          showCopied(btn);
        }).catch(function() {
          createSnackbar({ message: '请手动复制', duration: 3000 });
        });
      }
    });
  });

  function showCopied(btn) {
    btn.textContent = '已复制!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = '复制';
      btn.classList.remove('copied');
    }, 2000);
  }
}

function initReadingTime() {
  var readingTime = document.querySelector('.reading-time');
  if (!readingTime) return;

  var container = document.querySelector('.post-container');
  if (!container) return;

  var text = container.textContent;
  var zhCount = (text.match(/[一-鿿]/g) || []).length;
  var enText = text.replace(/[一-鿿]/g, ' ');
  var enWords = enText.split(/\s+/).filter(function(w) { return w.length > 0; }).length;
  var minutes = Math.ceil(zhCount / 500 + enWords / 200);
  if (minutes < 1) minutes = 1;

  readingTime.innerHTML = '<svg class="icon icon-clock"><use href="#icon-clock"></use></svg> 约 ' + minutes + ' 分钟';
}

function initLazyImages() {
  document.querySelectorAll('.post-container img:not([loading])').forEach(function(img) {
    img.setAttribute('loading', 'lazy');
  });
}

function initCardFadeIn() {
  var cards = document.querySelectorAll('.postlist-container .post-preview');
  if (!cards.length) return;

  cards.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(function(el) { observer.observe(el); });
  } else {
    cards.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

function initLightbox() {
  var lightbox = document.createElement('div');
  lightbox.id = 'img-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '图片预览');
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="关闭">&times;</button><img>';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector('img');
  var triggerEl = null;

  document.addEventListener('click', function(e) {
    if (e.target.matches('.post-container img')) {
      e.preventDefault();
      triggerEl = e.target;
      lightboxImg.src = e.target.src;
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
      lightbox.querySelector('.lightbox-close').focus();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
    if (triggerEl) { triggerEl.focus(); triggerEl = null; }
  }

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function initCodeLabels() {
  var skipLangs = ['plaintext', 'text', 'plain', 'default'];
  document.querySelectorAll('.highlighter-rouge').forEach(function(block) {
    var cls = block.getAttribute('class') || '';
    var match = cls.match(/language-(\w+)/);
    if (match && skipLangs.indexOf(match[1].toLowerCase()) === -1) {
      var label = document.createElement('span');
      label.className = 'code-lang-label';
      label.textContent = match[1];
      block.style.position = 'relative';
      block.appendChild(label);
    }
  });
}

function initNavbarToggle() {
  var $body = document.body;
  var $toggle = document.querySelector('.navbar-toggle');
  var $navbar = document.querySelector('#huxblog_navbar');
  var $collapse = document.querySelector('.navbar-collapse');
  if (!$toggle || !$navbar || !$collapse) return;

  var __HuxNav__ = {
    close: function() {
      $navbar.className = " ";
      setTimeout(function() {
        if ($navbar.className.indexOf('in') < 0) {
          $collapse.style.height = "0px";
        }
      }, 400);
      $toggle.setAttribute('aria-expanded', 'false');
    },
    open: function() {
      $collapse.style.height = "auto";
      $navbar.className += " in";
      $toggle.setAttribute('aria-expanded', 'true');
    }
  };

  $toggle.addEventListener('click', function() {
    if ($navbar.className.indexOf('in') > 0) {
      __HuxNav__.close();
    } else {
      __HuxNav__.open();
    }
  });

  document.addEventListener('click', function(e) {
    if (e.target === $toggle) return;
    if (e.target.className === 'icon-bar') return;
    __HuxNav__.close();
  });
}

function initThemeToggle() {
  var btn = document.getElementById('theme-toggle-btn');
  var iconSvg = document.getElementById('theme-icon-svg');
  if (!btn || !iconSvg) return;

  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    iconSvg.innerHTML = '<use href="#icon-sun"></use>';
  }

  // Sync Giscus theme on load
  function syncGiscus(dark) {
    var iframe = document.querySelector('.giscus-frame');
    if (iframe) {
      iframe.contentWindow.postMessage({
        giscus: { setConfig: { theme: dark ? 'dark' : 'light' } }
      }, 'https://giscus.app');
    }
  }
  // Wait for Giscus iframe to load, then sync
  window.addEventListener('message', function(e) {
    if (e.origin !== 'https://giscus.app') return;
    if (!(typeof e.data === 'object' && e.data.giscus)) return;
    syncGiscus(document.documentElement.getAttribute('data-theme') === 'dark');
  });

  btn.addEventListener('click', function() {
    var html = document.documentElement;
    var wasDark = html.getAttribute('data-theme') === 'dark';
    if (wasDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      iconSvg.innerHTML = '<use href="#icon-moon"></use>';
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      iconSvg.innerHTML = '<use href="#icon-sun"></use>';
    }
    syncGiscus(!wasDark);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', !wasDark ? '#1a1a2e' : '#000000');
    }
  });
}

function initCatalog() {
  var catalogBodyEl = document.querySelector('.catalog-body');
  if (!catalogBodyEl) return;

  var containerSelector = document.querySelector('.post-container.en') ? 'div.post-container.active' : 'div.post-container';
  var container = document.querySelector(containerSelector);
  if (!container) return;

  var headings = container.querySelectorAll('h1,h2,h3,h4,h5,h6');
  catalogBodyEl.innerHTML = '';

  headings.forEach(function(heading) {
    var tagName = heading.tagName.toLowerCase();
    var id = heading.id;
    if (!id) return;
    var text = heading.textContent;
    var a = document.createElement('a');
    a.href = '#' + id;
    a.rel = 'nofollow';
    a.textContent = text;
    var li = document.createElement('li');
    li.className = tagName + '_nav';
    li.appendChild(a);
    catalogBodyEl.appendChild(li);
  });

  var toggle = document.querySelector('.catalog-toggle');
  if (toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var catalog = document.querySelector('.side-catalog');
      if (catalog) catalog.classList.toggle('fold');
    });
  }

  if (typeof OnePageNav !== 'undefined' && catalogBodyEl) {
    new OnePageNav(catalogBodyEl, {
      currentClass: "active",
      changeHash: false,
      scrollSpeed: 700,
      scrollThreshold: 0.2,
      padding: 80
    }).init();
  }
}

function initSearch() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  if (typeof SimpleJekyllSearch !== 'undefined') {
    SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: resultsContainer,
      json: '/search.json?v=' + Date.now(),
      searchResultTemplate: '<div class="post-preview item"><a href="{url}"><h2 class="post-title">{title}</h2><h3 class="post-subtitle">{subtitle}</h3><hr></a></div>',
      noResultsText: 'No results',
      limit: 50,
      fuzzy: false,
      templateMiddleware: function(prop, value, template) {
        if (prop === 'subtitle' || prop === 'title') {
          if (value.indexOf("code") > -1) {
            return htmlDecode(value);
          }
          return value;
        }
      }
    });
  }

  var searchPage = document.querySelector('.search-page');
  var searchOpen = document.querySelector('.search-icon');
  var searchClose = document.querySelector('.search-icon-close');
  if (!searchPage || !searchOpen) return;

  searchOpen.addEventListener('click', function(e) {
    e.preventDefault();
    searchPage.classList.toggle('search-active');
    var prevClasses = document.body.className || '';
    setTimeout(function() {
      document.body.classList.add('no-scroll');
    }, 400);

    if (searchPage.classList.contains('search-active')) {
      if (searchClose) {
        searchClose.addEventListener('click', function handler(e) {
          e.preventDefault();
          searchPage.classList.remove('search-active');
          document.body.className = prevClasses;
          searchClose.removeEventListener('click', handler);
        });
      }
      if (searchInput) searchInput.focus();
    }
  });
}

function initKeynoteResize() {
  var header = document.getElementsByTagName("header")[0];
  if (!header) return;

  function resize() {
    header.style.height = (window.innerHeight - 85) + 'px';
  }

  resize();
  window.addEventListener('load', resize);
  window.addEventListener('resize', resize);
}

// ===== Single DOMContentLoaded handler =====
document.addEventListener('DOMContentLoaded', function() {
  initResponsiveTables();
  initResponsiveVideos();
  initNavbarToggle();
  initNavbar();
  initProgressBar();
  initBackToTop();
  initCodeCopy();
  initReadingTime();
  initLazyImages();
  initCardFadeIn();
  initLightbox();
  initCodeLabels();
  initThemeToggle();
  initCatalog();
  initSearch();
});

// Expose for multilingual pages
window.generateCatalog = function(selector) {
  var catalogBodyEl = document.querySelector(selector);
  if (!catalogBodyEl) return false;

  var containerSelector = document.querySelector('.post-container.en') ? 'div.post-container.active' : 'div.post-container';
  var container = document.querySelector(containerSelector);
  if (!container) return false;

  var headings = container.querySelectorAll('h1,h2,h3,h4,h5,h6');
  catalogBodyEl.innerHTML = '';

  headings.forEach(function(heading) {
    var tagName = heading.tagName.toLowerCase();
    var id = heading.id;
    if (!id) return;
    var text = heading.textContent;
    var a = document.createElement('a');
    a.href = '#' + id;
    a.rel = 'nofollow';
    a.textContent = text;
    var li = document.createElement('li');
    li.className = tagName + '_nav';
    li.appendChild(a);
    catalogBodyEl.appendChild(li);
  });
  return true;
};
