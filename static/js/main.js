// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
})();

// TOC scroll tracking
(function () {
  var tocNav = document.querySelector('#TableOfContents');
  if (!tocNav) return;

  var headings = document.querySelectorAll(
    '.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id]'
  );
  var tocLinks = document.querySelectorAll('#TableOfContents a');
  if (!headings.length || !tocLinks.length) return;

  var activeLink = null;

  function getOffsets() {
    var offsets = [];
    headings.forEach(function (h) {
      offsets.push({ id: h.id, offset: h.offsetTop });
    });
    offsets.sort(function (a, b) { return a.offset - b.offset; });
    return offsets;
  }

  var offsets = getOffsets();

  function scrollHandler() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var newActive = null;

    offsets.forEach(function (section) {
      if (scrollTop >= section.offset - 20) {
        newActive = section.id;
      }
    });

    if (!newActive) return;

    var link = tocNav.querySelector('a[href="#' + newActive + '"]');
    if (link && link !== activeLink) {
      if (activeLink) activeLink.classList.remove('active');
      link.classList.add('active');
      activeLink = link;
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        scrollHandler();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener('resize', function () {
    offsets = getOffsets();
    scrollHandler();
  });

  scrollHandler();
})();

// Theme toggle
(function () {
  var STORAGE_KEY = 'warmpaper-theme';
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return mql.matches ? 'dark' : 'light';
  }

  function syncIcon() {
    btn.setAttribute('data-theme-state', currentTheme());
  }

  btn.addEventListener('click', function () {
    // Enable smooth transition for the toggle action only
    document.documentElement.style.transition = 'background-color 0.25s, color 0.25s';
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    btn.setAttribute('data-theme-state', next);
    // Remove transition after animation completes to prevent FOUC on page load
    setTimeout(function () {
      document.documentElement.style.transition = '';
    }, 300);
  });

  mql.addEventListener('change', function () {
    var hasManual = false;
    try { hasManual = !!localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!hasManual) {
      document.documentElement.setAttribute('data-theme', currentTheme());
      syncIcon();
    }
  });

  syncIcon();
})();

// Code block copy button
(function () {
  var blocks = document.querySelectorAll('.highlight, figure.highlight');
  if (!blocks.length) return;

  blocks.forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '复制代码');
    btn.textContent = 'Copy';

    // Find the code element or table cell with code
    var codeEl = block.querySelector('table code') || block.querySelector('code');

    btn.addEventListener('click', function () {
      if (!codeEl) return;
      var text = codeEl.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      });
    });

    block.style.position = 'relative';
    block.appendChild(btn);
  });
})();

// Reading progress bar
(function () {
  var postContent = document.querySelector('.post-content');
  if (!postContent) return;

  var bar = document.createElement('div');
  bar.className = 'reading-progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    bar.style.transform = 'scaleX(' + progress + ')';
  }, { passive: true });
})();

