/* ============================================================
   HATCHLINE — Lead capture / download gate
   ------------------------------------------------------------
   HOW THIS WORKS
   A visitor clicks "Download", fills in name / email / company /
   country (all required), and only then does the actual file
   download start.

   WHERE THE LEAD DATA GOES
   This is a static site with no server, so submitted details have
   to go SOMEWHERE else to be useful to you:

   1. RECOMMENDED: Formspree (or any similar form backend).
      Set FORMSPREE_ENDPOINT below to your form's endpoint URL.
      Every submission lands in your Formspree dashboard (and by
      default Formspree also emails you a copy). Free tier covers
      a new product's early traffic.
      Sign up: https://formspree.io -> New Form -> copy the
      endpoint that looks like https://formspree.io/f/xxxxxxxx

   2. FALLBACK (no signup required): if FORMSPREE_ENDPOINT is left
      as the placeholder below, this file automatically falls back
      to opening the visitor's email client with their details
      pre-filled, addressed to you. It still gates the download,
      but depends on the visitor having an email client configured
      - which many phones/work laptops don't - so it will silently
      fail to notify you for some visitors. Formspree doesn't have
      that problem, which is why it's the recommended option.
   ============================================================ */

/* FORMSPREE_ENDPOINT and HATCHLINE_LEAD_NOTIFY_EMAIL now live in
   assets/js/config.js, loaded before this file. */

var HATCHLINE_COUNTRIES = [
  "India", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain",
  "United States", "United Kingdom", "Canada", "Australia", "New Zealand", "Ireland",
  "Singapore", "Malaysia", "Philippines", "Indonesia", "Thailand", "Vietnam",
  "Germany", "France", "Netherlands", "Spain", "Italy", "Sweden", "Norway", "Denmark",
  "South Africa", "Nigeria", "Kenya", "Egypt",
  "China", "Japan", "South Korea", "Hong Kong",
  "Brazil", "Mexico", "Argentina",
  "Other"
];

(function(){
  "use strict";

  var modalInjected = false;

  function injectModalOnce(){
    if (modalInjected) return;
    modalInjected = true;

    var overlay = document.createElement('div');
    overlay.id = 'hlDownloadOverlay';
    overlay.className = 'hl-modal-overlay';
    overlay.innerHTML =
      '<div class="hl-modal" role="dialog" aria-modal="true" aria-labelledby="hlModalTitle">' +
        '<button type="button" class="hl-modal-close" aria-label="Close">&times;</button>' +
        '<span class="eyebrow" id="hlModalExtLabel"></span>' +
        '<h3 id="hlModalTitle">Get the download</h3>' +
        '<p class="hl-modal-sub">A few details before your file downloads — takes 20 seconds.</p>' +
        '<form id="hlLeadForm" novalidate>' +
          '<div class="hl-field"><label>Full name<span class="req-mark">*</span></label><input id="hlName" required autocomplete="name"></div>' +
          '<div class="hl-field"><label>Email address<span class="req-mark">*</span></label><input id="hlEmail" type="email" required autocomplete="email"></div>' +
          '<div class="hl-field"><label>Company / firm<span class="req-mark">*</span></label><input id="hlCompany" required autocomplete="organization"></div>' +
          '<div class="hl-field"><label>Country<span class="req-mark">*</span></label>' +
            '<select id="hlCountry" required><option value="" disabled selected>Select your country</option>' +
            HATCHLINE_COUNTRIES.map(function(c){ return '<option value="' + c + '">' + c + '</option>'; }).join('') +
            '</select></div>' +
          '<p class="hl-error" id="hlError" style="display:none;"></p>' +
          '<button type="submit" class="btn btn-primary" id="hlSubmitBtn" style="width:100%;justify-content:center;">Download now</button>' +
          '<p class="hl-privacy">Used only to follow up about your license. Not shared with anyone else.</p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e){
      if (e.target === overlay) closeModal();
    });
    overlay.querySelector('.hl-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    document.getElementById('hlLeadForm').addEventListener('submit', onSubmit);
  }

  var currentExt = null;

  function openModal(ext){
    injectModalOnce();
    currentExt = ext;
    document.getElementById('hlModalExtLabel').textContent = ext.name;
    document.getElementById('hlError').style.display = 'none';
    document.getElementById('hlLeadForm').reset();
    document.getElementById('hlDownloadOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ document.getElementById('hlName').focus(); }, 50);
  }

  function closeModal(){
    var overlay = document.getElementById('hlDownloadOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showError(msg){
    var el = document.getElementById('hlError');
    el.textContent = msg;
    el.style.display = 'block';
  }

  function triggerFileDownload(url){
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function onSubmit(e){
    e.preventDefault();

    var name = document.getElementById('hlName').value.trim();
    var email = document.getElementById('hlEmail').value.trim();
    var company = document.getElementById('hlCompany').value.trim();
    var country = document.getElementById('hlCountry').value;

    if (!name || !email || !company || !country) {
      showError('All fields are required.');
      return;
    }
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showError('Enter a valid email address.');
      return;
    }

    var btn = document.getElementById('hlSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    var payload = {
      name: name, email: email, company: company, country: country,
      extension: currentExt.name, slug: currentExt.slug,
      _subject: 'Hatchline download - ' + currentExt.name + ' - ' + name
    };

    var usingFormspree = FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.indexOf('PASTE_YOUR') === -1;

    if (usingFormspree) {
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(res){
        finishAndDownload();
      }).catch(function(){
        // Even if the network request fails, don't block a real customer's
        // download - fall back to the mailto notification instead.
        mailtoFallback(payload);
        finishAndDownload();
      });
    } else {
      mailtoFallback(payload);
      finishAndDownload();
    }
  }

  function mailtoFallback(payload){
    var subject = encodeURIComponent(payload._subject);
    var body = encodeURIComponent(
      'New download request via Hatchline\n\n' +
      'Extension: ' + payload.extension + '\n' +
      'Name: ' + payload.name + '\n' +
      'Email: ' + payload.email + '\n' +
      'Company: ' + payload.company + '\n' +
      'Country: ' + payload.country + '\n'
    );
    var win = window.open('mailto:' + HATCHLINE_LEAD_NOTIFY_EMAIL + '?subject=' + subject + '&body=' + body, '_blank');
    // some browsers block window.open for mailto; fall back to same-tab nav
    if (!win) {
      window.location.href = 'mailto:' + HATCHLINE_LEAD_NOTIFY_EMAIL + '?subject=' + subject + '&body=' + body;
    }
  }

  function finishAndDownload(){
    triggerFileDownload(currentExt.pricing.downloadUrl);
    var btn = document.getElementById('hlSubmitBtn');
    btn.disabled = false;
    btn.textContent = 'Download now';
    closeModal();
  }

  // expose a single global function the rest of the site calls
  window.hatchlineOpenDownload = openModal;
})();
