// lili Blog — article features module.
// Loaded only on article pages. Contains TOC, lightbox, code blocks, progress bar, mermaid.
// Reuses the global scroll handler from site.js if available.

// ===== Scroll handler (reuse global or create) =====
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
    desktopItems.forEach(function (li) {
      if (li.getAttribute('data-depth') === '2') {
        h2Items.push({ el: li, children: [] });
      } else if (h2Items.length) {
        h2Items[h2Items.length - 1].children.push(li);
      }
    });

    h2Items.forEach(function (group) {
      if (group.children.length <= 1) return;
      var link = group.el.querySelector('a');
      if (!link) return;

      group.children.forEach(function (c) { c.style.display = 'none'; });
      group.el.classList.add('toc-collapsed');

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

    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeSheet(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('toc-sheet-open')) closeSheet();
    });
  }
}

// ===== Image lightbox (zero-dependency) =====
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
    setTimeout(function () {
      el.remove();
    }, 260);
    overlay = null;
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('click', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG') return;
    var scope = img.closest('.article-content, .long-form');
    if (!scope) return;
    if (img.getAttribute('fetchpriority')) return;
    if (img.closest('a')) return;

    e.preventDefault();
    open(img.src, img.alt);
  });

  document.addEventListener('click', function (e) {
    if (!overlay) return;
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay) close();
  });
}

// ===== Code blocks: copy button + language label =====
function initCodeBlocks() {
  document.querySelectorAll('.article-content pre.astro-code').forEach(function (pre) {
    var code = pre.querySelector('code');
    if (!code) return;

    var lang = pre.getAttribute('data-language') || '';
    if (lang && lang !== 'plaintext' && lang !== 'text') {
      var label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      pre.appendChild(label);
    }

    var btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', '复制代码');
    btn.setAttribute('title', '复制');
    btn.textContent = 'Copy';
    pre.appendChild(btn);

    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('code-copy-done');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('code-copy-done');
        }, 1500);
      });
    });
  });
}

// ===== Reading progress bar =====
function initProgressBar() {
  var gutter = document.querySelector('.article-body .gutter');
  var bar = gutter ? gutter.querySelector('.progress-fill') : null;
  var label = gutter ? gutter.querySelector('.progress-label') : null;
  var content = document.querySelector('.article-content');
  if (!gutter || !bar || !content) return;

  function update() {
    var rect = content.getBoundingClientRect();
    var scrollable = Math.max(1, rect.height - window.innerHeight);
    var pct = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    var percent = Math.round(pct * 100);
    gutter.style.setProperty('--article-progress', percent + '%');
    if (label) label.textContent = percent + '%';
  }

  update();
  onScroll(update);
  window.addEventListener('resize', update);
}

// ===== Mermaid diagrams (loaded from CDN only when needed) =====
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
    .catch(function () {});
}

// ===== Init all article features (View Transitions compatible) =====
var _articleInited = false;
function initArticlePage() {
  if (_articleInited) return;
  _articleInited = true;
  initTOC();
  initLightbox();
  initCodeBlocks();
  initProgressBar();
  initMermaid();
}

document.addEventListener('astro:after-swap', function () {
  _articleInited = false;
});

document.addEventListener('astro:page-load', initArticlePage);
document.addEventListener('DOMContentLoaded', initArticlePage);
