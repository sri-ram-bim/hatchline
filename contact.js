(function(){
  "use strict";

  var form = document.getElementById('contactForm');
  var msgEl = document.getElementById('formMsg');
  var btn = document.getElementById('cSubmitBtn');

  function showMsg(text, isOk){
    msgEl.textContent = text;
    msgEl.className = isOk ? 'ok' : 'err';
    msgEl.style.display = 'block';
  }

  function mailtoFallback(payload){
    var subject = encodeURIComponent('Hatchline Contact - ' + payload.type + ' - ' + payload.name);
    var body = encodeURIComponent(
      'Type: ' + payload.type + '\n' +
      'Name: ' + payload.name + '\n' +
      'Email: ' + payload.email + '\n\n' +
      'Message:\n' + payload.message
    );
    window.location.href = 'mailto:' + HATCHLINE_LEAD_NOTIFY_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var name = document.getElementById('cName').value.trim();
    var email = document.getElementById('cEmail').value.trim();
    var type = document.getElementById('cType').value;
    var message = document.getElementById('cMessage').value.trim();

    if (!name || !email || !type || !message) {
      showMsg('All fields are required.', false);
      return;
    }
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showMsg('Enter a valid email address.', false);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    var payload = {
      name: name, email: email, type: type, message: message,
      _subject: 'Hatchline Contact - ' + type + ' - ' + name
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
        btn.textContent = 'Send message';
        if (res.ok) {
          showMsg('✓ Message sent — thanks, you\'ll hear back soon.', true);
          form.reset();
        } else {
          showMsg('Something went wrong sending that. Try again, or email directly.', false);
        }
      }).catch(function(){
        btn.disabled = false;
        btn.textContent = 'Send message';
        mailtoFallback(payload);
      });
    } else {
      btn.disabled = false;
      btn.textContent = 'Send message';
      mailtoFallback(payload);
    }
  });
})();
