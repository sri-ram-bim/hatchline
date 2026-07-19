(function(){
  "use strict";

  function qs(name){
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
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

  // ---- render via the shared module (same code path the build script uses) ----
  var rendered = HatchlineRender.renderExtensionPage(ext);

  document.getElementById('pageTitle').textContent = rendered.title;
  document.getElementById('pageDesc').setAttribute('content', rendered.description);
  navCta.innerHTML = rendered.navCtaHtml;
  body.innerHTML = rendered.bodyHtml;

  var mailtoAccess = rendered.mailtoAccess;

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
