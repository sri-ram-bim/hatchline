(function(){
  "use strict";

  var form = document.getElementById('reqForm');
  var msgEl = document.getElementById('formMsg');
  var btn = document.getElementById('rSubmitBtn');

  function showMsg(text, isOk){
    msgEl.textContent = text;
    msgEl.className = isOk ? 'ok' : 'err';
    msgEl.style.display = 'block';
  }

  function mailtoFallback(payload){
    var subject = encodeURIComponent('Hatchline Extension Request - ' + payload.name);
    var body = encodeURIComponent(
      'Task to automate:\n' + payload.task + '\n\n' +
      'Frequency: ' + payload.frequency + '\n' +
      'Revit version(s): ' + payload.revitVersion + '\n' +
      'Notes: ' + payload.notes + '\n\n' +
      'Name: ' + payload.name + '\n' +
      'Email: ' + payload.email
    );
    window.location.href = 'mailto:' + HATCHLINE_LEAD_NOTIFY_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var name = document.getElementById('rName').value.trim();
    var email = document.getElementById('rEmail').value.trim();
    var task = document.getElementById('rTask').value.trim();
    var frequency = document.getElementById('rFrequency').value;
    var revitVersion = document.getElementById('rRevitVersion').value.trim();
    var notes = document.getElementById('rNotes').value.trim();

    if (!name || !email || !task) {
      showMsg('Name, email, and the task description are required.', false);
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
      name: name, email: email, task: task, frequency: frequency,
      revitVersion: revitVersion, notes: notes,
      _subject: 'Hatchline Extension Request - ' + name
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
        btn.textContent = 'Send request';
        if (res.ok) {
          showMsg('✓ Sent — thanks, we\'ll let you know if we can build it.', true);
          form.reset();
        } else {
          showMsg('Something went wrong sending that. Try again, or email directly.', false);
        }
      }).catch(function(){
        btn.disabled = false;
        btn.textContent = 'Send request';
        mailtoFallback(payload);
      });
    } else {
      btn.disabled = false;
      btn.textContent = 'Send request';
      mailtoFallback(payload);
    }
  });
})();
