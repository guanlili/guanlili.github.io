/*!
 * Hux Blog v1.8.2 (http://huxpro.github.io)
 * Copyright 2026 Hux <huxpro@gmail.com>
 * Licensed under Apache 2.0
 */

// responsive tables
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('table').forEach(function(table) {
        var wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        table.classList.add('table');
    });
});

// responsive embed videos
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').forEach(function(iframe) {
        var wrapper = document.createElement('div');
        wrapper.className = 'embed-responsive embed-responsive-16by9';
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
        iframe.classList.add('embed-responsive-item');
    });
});

// Navigation Scripts to Show Header on Scroll-Up
document.addEventListener('DOMContentLoaded', function() {
    var MQL = 1170;
    if (window.innerWidth <= MQL) return;

    var navbar = document.querySelector('.navbar-custom');
    var banner = document.querySelector('.intro-header .container');
    if (!navbar || !banner) return;

    var headerHeight = navbar.offsetHeight;
    var bannerHeight = banner.offsetHeight;
    var previousTop = 0;

    window.addEventListener('scroll', function() {
        var currentTop = window.pageYOffset;
        var catalog = document.querySelector('.side-catalog');

        if (currentTop < previousTop) {
            if (currentTop > 0 && navbar.classList.contains('is-fixed')) {
                navbar.classList.add('is-visible');
            } else {
                navbar.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            navbar.classList.remove('is-visible');
            if (currentTop > headerHeight && !navbar.classList.contains('is-fixed')) {
                navbar.classList.add('is-fixed');
            }
        }
        previousTop = currentTop;

        if (catalog) {
            catalog.style.display = '';
            if (currentTop > (bannerHeight + 41)) {
                catalog.classList.add('fixed');
            } else {
                catalog.classList.remove('fixed');
            }
        }
    });
});

// Reading Progress Bar
document.addEventListener('DOMContentLoaded', function() {
    var progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var scrollTop = window.pageYOffset;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = scrollPercent + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    var backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 400) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Code Block Copy Button
document.addEventListener('DOMContentLoaded', function() {
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
                    fallbackCopy(text, btn);
                });
            } else {
                fallbackCopy(text, btn);
            }
        });
    });

    function fallbackCopy(text, btn) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px;top:-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopied(btn);
        } catch (e) {}
        document.body.removeChild(textarea);
    }

    function showCopied(btn) {
        btn.textContent = '已复制!';
        btn.classList.add('copied');
        setTimeout(function() {
            btn.textContent = '复制';
            btn.classList.remove('copied');
        }, 2000);
    }
});

// Estimated Reading Time
document.addEventListener('DOMContentLoaded', function() {
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
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.post-container img').forEach(function(img) {
        if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

// Homepage Post Card Fade-in on Scroll
document.addEventListener('DOMContentLoaded', function() {
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
});

// Image Lightbox
document.addEventListener('DOMContentLoaded', function() {
    var lightbox = document.createElement('div');
    lightbox.id = 'img-lightbox';
    lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img>';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('img');

    document.addEventListener('click', function(e) {
        if (e.target.matches('.post-container img')) {
            e.preventDefault();
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
});

// Code Block Language Labels
document.addEventListener('DOMContentLoaded', function() {
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
});

// ===== Snackbar (merged from snackbar.js) =====
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

// ===== Service Worker Registration (merged from sw-registration.js) =====
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
