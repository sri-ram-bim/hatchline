(function(){
  "use strict";

  function qs(name){
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  var body = document.getElementById('pageBody');
  var navCta = document.getElementById('navCta');

  // Static pages built by scripts/build-pages.js (e.g. bulk-export.html)
  // carry their slug right on the page via data-slug, since there's no
  // ?slug= query string to read on those URLs. Fall back to the query
  // string for the old-style extension.html?slug=... URL.
  var slug = body.getAttribute('data-slug') || qs('slug');
  var ext = HATCHLINE_EXTENSIONS.find(function(e){ return e.slug === slug; });

  if (!ext) {
    document.getElementById('pageTitle').textContent = 'Not found — Hatchline';
    body.innerHTML =
      '<div class="wrap" style="padding:60px 0;">' +
        '<span class="eyebrow">404</span>' +
        '<h1 style="font-size:34px;">Extension not found</h1>' +
        '<p style="margin-top:14px;color:#4B5157;">That listing doesn\'t exist yet — it may have moved.</p>' +
        '<a class="btn btn-primary" style="margin-top:24px;"
