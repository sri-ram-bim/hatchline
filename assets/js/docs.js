(function(){
  "use strict";

  function qs(name){
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function slugify(text){
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  var slug = qs('slug');
  var ext = HATCHLINE_EXTENSIONS.find(function(e){ return e.slug === slug; });

  var body = document.getElementById('pageBody');
  var navCta = document.getElementById('navCta');

  if (!ext || !ext.docs) {
    document.getElementById('pageTitle').textContent = 'Not found — Hatchline';
    body.innerHTML =
      '<div class="wrap" style="padding:60px 0;">' +
        '<span class="eyebrow">404</span>' +
        '<h1 style="font-size:34px;">Documentation not found</h1>' +
        '<p style="margin-top:14px;color:#4B5157;">That extension doesn\'t exist, or doesn\'t have a docs page yet.</p>' +
        '<a class="btn btn-primary" style="margin-top:24px;" href="index.html">Back to all extensions</a>' +
      '</div>';
    return;
  }

  document.getElementById('pageTitle').textContent = ext.name + ' — Docs — Hatchline';
  document.getElementById('pageDesc').setAttribute('content', 'Setup guide and documentation for ' + ext.name + '.');
  navCta.innerHTML = '<a class="btn btn-ghost btn-sm" href="extension.html?slug=' + encodeURIComponent(ext.slug) + '">← ' + escapeHtml(ext.name) + '</a>';

  var tocLinks = [];
  var sectionsHtml = ext.docs.sections.map(function(section){
    var id = slugify(section.heading);
    tocLinks.push({ id: id, label: section.heading });

    var paras = (section.paragraphs || []).map(function(p){ return '<p>' + escapeHtml(p) + '</p>'; }).join('');
    var code = section.code ? '<div class="docs-code">' + escapeHtml(section.code) + '</div>' : '';
    var parasAfter = (section.paragraphsAfter || []).map(function(p){ return '<p>' + escapeHtml(p) + '</p>'; }).join('');

    return '<div class="docs-section" id="' + id + '">' +
      '<h2>' + escapeHtml(section.heading) + '</h2>' +
      paras + code + parasAfter +
    '</div>';
  }).join('');

  var tocHtml = tocLinks.map(function(t, i){
    return '<a href="#' + t.id + '" data-target="' + t.id + '" class="' + (i === 0 ? 'active' : '') + '">' + escapeHtml(t.label) + '</a>';
  }).join('');

  body.innerHTML =
    '<section class="docs-hero">' +
      '<div class="wrap">' +
        '<a class="docs-back" href="extension.html?slug=' + encodeURIComponent(ext.slug) + '">\u2190 ' + escapeHtml(ext.name) + ' overview</a>' +
        '<span class="eyebrow">Documentation</span>' +
        '<h1 style="font-size:clamp(28px,3.6vw,40px);">' + escapeHtml(ext.name) + '</h1>' +
      '</div>' +
    '</section>' +
    '<section style="padding-top:10px;">' +
      '<div class="wrap docs-layout">' +
        '<nav class="docs-toc">' + tocHtml + '</nav>' +
        '<div>' + sectionsHtml + '</div>' +
      '</div>' +
    '</section>';

  // ---- highlight the TOC entry for whichever section is in view ----
  var tocEls = document.querySelectorAll('.docs-toc a');
  var sectionEls = document.querySelectorAll('.docs-section');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocEls.forEach(function(a){
            a.classList.toggle('active', a.getAttribute('data-target') === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sectionEls.forEach(function(el){ io.observe(el); });
  }
})();
