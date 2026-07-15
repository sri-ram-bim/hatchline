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

  var slug = qs('slug');
  var ext = HATCHLINE_EXTENSIONS.find(function(e){ return e.slug === slug; });

  var body = document.getElementById('pageBody');
  var navCta = document.getElementById('navCta');

  if (!ext) {
    document.getElementById('pageTitle').textContent = 'Not found — Hatchline';
    body.innerHTML =
      '<div class="wrap" style="padding:60px 0;">' +
        '<span class="eyebrow">404</span>' +
        '<h1 style="font-size:34px;">Extension not found</h1>' +
        '<p style="margin-top:14px;color:#4B5157;">That listing doesn\'t exist yet — it may have moved.</p>' +
        '<a class="btn btn-primary" style="margin-top:24px;" href="index.html">Back to all extensions</a>' +
      '</div>';
    return;
  }

  document.getElementById('pageTitle').textContent = ext.name + ' — Hatchline';
  document.getElementById('pageDesc').setAttribute('content', ext.shortDescription);

  navCta.innerHTML = '<a class="btn btn-primary btn-sm" href="#pricing">Download</a>';

  var mailtoAccess = 'mailto:' + ext.developer.email + '?subject=' + encodeURIComponent('Hatchline - ' + ext.name + ' - Access Request');

  // ---------------------------------------------------------
  // Build each section as an HTML string, then assemble.
  // ---------------------------------------------------------

  var comparisonRows = ext.comparison.map(function(row){
    return '<tr>' +
      '<td>' + escapeHtml(row.capability) + '</td>' +
      '<td class="col-manual">' + escapeHtml(row.manual) + '</td>' +
      '<td class="col-bulk">' + escapeHtml(row.tool) + '</td>' +
      '</tr>';
  }).join('');

  var featureCallouts = ext.features.map(function(f){
    return '<div class="callout">' +
      '<span class="tag">' + escapeHtml(f.tag) + '</span>' +
      '<h3>' + escapeHtml(f.title) + '</h3>' +
      '<p>' + escapeHtml(f.body) + '</p>' +
      '</div>';
  }).join('');

  var workflowCards = ext.workflow.map(function(w){
    return '<div class="wf-card">' +
      '<span class="wf-num">' + escapeHtml(w.num) + '</span>' +
      '<h3>' + escapeHtml(w.title) + '</h3>' +
      '<p>' + escapeHtml(w.body) + '</p>' +
      '</div>';
  }).join('');

  var pricingIncludes = ext.pricing.includes.map(function(i){ return '<li>' + escapeHtml(i) + '</li>'; }).join('');

  var changelogHtml = '';
  if (ext.changelog && ext.changelog.length) {
    changelogHtml = ext.changelog.map(function(entry, i){
      var items = entry.changes.map(function(c){ return '<li>' + escapeHtml(c) + '</li>'; }).join('');
      var downloadBtn = entry.downloadUrl
        ? '<button type="button" class="btn btn-ghost btn-sm changelog-download" data-version="' +
          escapeHtml(entry.version) + '" data-url="' + escapeHtml(entry.downloadUrl) + '">Download v' +
          escapeHtml(entry.version) + '</button>'
        : '';
      return '<div class="changelog-entry">' +
        '<div class="changelog-version">' +
          '<span class="version-badge">v' + escapeHtml(entry.version) + '</span>' +
          (i === 0 ? '<span class="changelog-latest">Latest</span>' : '') +
        '</div>' +
        '<ul class="changelog-list">' + items + '</ul>' +
        (downloadBtn ? '<div class="changelog-download-row">' + downloadBtn + '</div>' : '') +
      '</div>';
    }).join('');
  }

  var faqItems = ext.faq.map(function(item, i){
    return '<div class="faq-item' + (i === 0 ? ' open' : '') + '">' +
      '<button class="faq-q" aria-expanded="' + (i === 0 ? 'true' : 'false') + '">' +
        escapeHtml(item.q) + '<span class="plus">+</span>' +
      '</button>' +
      '<div class="faq-a"><div class="faq-a-in">' + escapeHtml(item.a) + '</div></div>' +
      '</div>';
  }).join('');

  var queueRows = [
    { num: 'M-201', name: 'First Floor HVAC' },
    { num: 'P-101', name: 'Basement Plumbing' },
    { num: 'E-301', name: 'Roof Electrical' },
    { num: 'A-104', name: 'Ground Floor Plan' }
  ].map(function(r){
    return '<div class="queue-row">' +
      '<span class="qbox" data-row></span>' +
      '<span class="qname">' + r.num + ' \u2014 ' + r.name + '</span>' +
      '<span class="qstatus" data-status>queued</span>' +
      '</div>';
  }).join('');

  var formatChips = ext.badges.map(function(b, i){
    return '<span class="fmt-chip" data-fmt="' + i + '">' + escapeHtml(b) + '</span>';
  }).join('');

  body.innerHTML =
    // ---- HERO ----
    '<section class="hero">' +
      '<div class="wrap">' +
        '<a class="back-link" href="index.html">\u2190 All extensions</a>' +
        '<div class="hero-grid">' +
          '<div>' +
            '<div class="titleblock">' +
              '<span class="tagx">' + escapeHtml(ext.heroEyebrowTag) + '</span>' +
              '<span>' + escapeHtml(ext.heroEyebrowLabel) + '</span>' +
              (ext.version ? '<span class="version-badge">v' + escapeHtml(ext.version) + '</span>' : '') +
            '</div>' +
            '<h1>' + escapeHtml(ext.tagline) + '</h1>' +
            '<p class="lede">' + escapeHtml(ext.longIntro) + '</p>' +
            '<div class="hero-ctas">' +
              '<a class="btn btn-primary" href="#pricing">Download \u2193</a>' +
              '<a class="btn btn-ghost" href="#workflow">See how it works \u2193</a>' +
            '</div>' +
          '</div>' +
          '<div class="queue-panel reveal" aria-hidden="true">' +
            '<div class="queue-head"><span>' + escapeHtml(ext.name) + ' \u2014 Export Queue</span><span class="pill">4 sheets</span></div>' +
            '<div class="queue-formats">' + formatChips + '</div>' +
            '<div class="queue-rows">' + queueRows + '</div>' +
            '<div class="queue-progress">' +
              '<div class="bar-track"><div class="bar-fill"></div></div>' +
              '<div class="bar-caption"><span>Exporting\u2026</span><span data-count>0 of 4 complete</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // ---- COMPARISON ----
    '<section class="grid-bg">' +
      '<div class="wrap">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Schedule \u2014 Comparison</span>' +
          '<h2>Where the time actually goes</h2>' +
          '<p>Manual export means re-opening the same dialog per format, per sheet, per revision.</p>' +
        '</div>' +
        '<div class="schedule-wrap reveal">' +
          '<table class="schedule">' +
            '<caption>' + escapeHtml(ext.name) + ' \u2014 Method Comparison</caption>' +
            '<thead><tr><th>Capability</th><th>Manual export</th><th>' + escapeHtml(ext.name) + '</th></tr></thead>' +
            '<tbody>' + comparisonRows + '</tbody>' +
          '</table>' +
        '</div>' +
        '<p class="schedule-note">' + escapeHtml(ext.compatibility) + '</p>' +
      '</div>' +
    '</section>' +

    // ---- FEATURES ----
    '<section>' +
      '<div class="wrap">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Detail Callouts</span>' +
          '<h2>What\'s actually in the tool</h2>' +
        '</div>' +
        '<div class="callouts reveal">' + featureCallouts + '</div>' +
      '</div>' +
    '</section>' +

    // ---- WORKFLOW ----
    '<section id="workflow" class="grid-bg">' +
      '<div class="wrap">' +
        '<div class="section-head reveal"><span class="eyebrow">How it works</span><h2>Three tabs, one export</h2></div>' +
        '<div class="workflow reveal">' + workflowCards + '</div>' +
      '</div>' +
    '</section>' +

    // ---- CHANGELOG (only if the extension has version history) ----
    (changelogHtml ?
      '<section id="changelog">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            '<span class="eyebrow">Version History</span>' +
            '<h2>What\'s changed</h2>' +
          '</div>' +
          '<div class="changelog-wrap reveal">' + changelogHtml + '</div>' +
        '</div>' +
      '</section>'
      : '') +

    // ---- DOWNLOAD ----
    '<section id="pricing">' +
      '<div class="wrap">' +
        '<div class="section-head reveal">' +
          '<span class="eyebrow">Get it</span>' +
          '<h2>Download</h2>' +
        '</div>' +
        '<div class="pricing reveal">' +
          '<div class="price-card">' +
            '<span class="price-tag">' + escapeHtml(ext.name) + '</span>' +
            (ext.pricing.free
              ? '<div class="price-amount"><span class="big">Free</span></div>'
              : '<div class="price-amount"><span class="big">\u20B9' + ext.pricing.inr + '</span><span class="alt">\u2248 AED ' + ext.pricing.aed.toFixed(2) + '</span></div>') +
            '<span class="price-model">' + escapeHtml(ext.pricing.model) + '</span>' +
            '<ul class="price-list">' + pricingIncludes + '</ul>' +
            '<button type="button" class="btn btn-primary" id="hlDownloadBtn" style="width:100%;justify-content:center;">Download now</button>' +
            '<p class="price-note">' + escapeHtml(ext.pricing.note) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // ---- CREDIBILITY + FAQ ----
    '<section class="grid-bg">' +
      '<div class="wrap cred">' +
        '<div class="reveal">' +
          '<span class="eyebrow">Who built this</span>' +
          '<p class="cred-quote">\u201C' + escapeHtml(ext.developer.quote) + '\u201D</p>' +
          '<p class="cred-byline">' + escapeHtml(ext.developer.name.toUpperCase()) + ' \u2014 ' + escapeHtml(ext.developer.role) + '<br>' + escapeHtml(ext.developer.email) + '</p>' +
        '</div>' +
        '<div class="reveal">' +
          '<span class="eyebrow">Frequently asked</span>' +
          '<div id="faqList">' + faqItems + '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // ---- CTA STRIP ----
    '<section>' +
      '<div class="wrap">' +
        '<div class="cta-strip reveal">' +
          '<div><h2>' + escapeHtml(ext.tagline) + '</h2><p>Questions before you get started? Reach out and get a straight answer.</p></div>' +
          '<a class="btn btn-primary" href="contact.html">Contact</a>' +
        '</div>' +
      '</div>' +
    '</section>';

  // ---- wire the pricing "Download now" button to the lead-capture gate ----
  var downloadBtn = document.getElementById('hlDownloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(){
      if (typeof window.hatchlineOpenDownload === 'function') {
        window.hatchlineOpenDownload(ext);
      } else {
        console.error('lead-capture.js did not load - falling back to email.');
        window.location.href = mailtoAccess;
      }
    });
  }

  // ---- wire each changelog entry's "Download vX.X" button ----
  document.querySelectorAll('.changelog-download').forEach(function(btn){
    btn.addEventListener('click', function(){
      var url = btn.getAttribute('data-url');
      var version = btn.getAttribute('data-version');
      if (typeof window.hatchlineOpenDownload === 'function') {
        window.hatchlineOpenDownload(ext, url, version);
      } else {
        console.error('lead-capture.js did not load - falling back to email.');
        window.location.href = mailtoAccess;
      }
    });
  });

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    });
  });

  // ---- scroll reveal ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // ---- signature queue animation loop ----
  (function(){
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var boxes = document.querySelectorAll('[data-row]');
    var statuses = document.querySelectorAll('[data-status]');
    var chips = document.querySelectorAll('.fmt-chip');
    var counter = document.querySelector('[data-count]');
    if (!boxes.length || reduced) return;

    var total = boxes.length;
    function resetRows(){
      boxes.forEach(function(b){ b.classList.remove('done'); });
      statuses.forEach(function(s){ s.textContent = 'queued'; s.classList.remove('done'); });
      chips.forEach(function(c){ c.classList.remove('lit'); });
      counter.textContent = '0 of ' + total + ' complete';
    }

    function runCycle(){
      resetRows();
      var chipDelay = 550;
      chips.forEach(function(chip, i){
        setTimeout(function(){ chip.classList.add('lit'); }, 300 + i * chipDelay);
      });
      var rowStart = 300 + chips.length * chipDelay + 200;
      var rowStep = 650;
      boxes.forEach(function(box, i){
        setTimeout(function(){
          box.classList.add('done');
          statuses[i].textContent = 'done';
          statuses[i].classList.add('done');
          counter.textContent = (i + 1) + ' of ' + total + ' complete';
        }, rowStart + i * rowStep);
      });
    }

    runCycle();
    setInterval(runCycle, 5500);
  })();

})();
