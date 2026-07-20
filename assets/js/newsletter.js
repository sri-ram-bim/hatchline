(function(){
  "use strict";

  var form = document.getElementById('newsletterForm');
  if (!form) return;
  var msgEl = document.getElementById('newsletterMsg');
  var btn = document.getElementById('newsletterBtn');

  function showMsg(text, isOk){
    msgEl.textContent = text;
    msgEl.className = 'newsletter-msg ' + (isOk ? 'ok' : 'err');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var email = document.getElementById('newsletterEmail').value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showMsg('Enter a valid email address.', false);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    var payload = {
      email: email,
      _subject: 'Hatchline Newsletter Signup - ' + email
    };

    var usingFormspree = typeof FORMSPREE_ENDPOINT !== 'undefined' &&
      FORMSPREE_ENDPOINT.indexOf('PASTE_YOUR') === -1;

    if (usingFormspree) {
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(res){
        btn.disabled = false;
        btn.textContent = 'Notify me';
        if (res.ok) {
          showMsg('✓ You\'re on the list.', true);
          form.reset();
        } else {
          showMsg('Something went wrong. Try again in a moment.', false);
        }
      }).catch(function(){
        btn.disabled = false;
        btn.textContent = 'Notify me';
        showMsg('Could not reach the server — try again in a moment.', false);
      });
    } else {
      btn.disabled = false;
      btn.textContent = 'Notify me';
      window.location.href = 'mailto:' + HATCHLINE_LEAD_NOTIFY_EMAIL +
        '?subject=' + encodeURIComponent('Hatchline Newsletter Signup') +
        '&body=' + encodeURIComponent('Please add me to the newsletter: ' + email);
    }
  });
})();
