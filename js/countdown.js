(function () {
  "use strict";

  // Wedding: October 10th, 2026, 12:00 noon, Lagos (WAT = UTC+1)
  // Expressed in UTC so the countdown is correct for every guest's timezone.
  var TARGET = new Date("2026-10-10T12:00:00+01:00").getTime();

  var elDays = document.getElementById("cdDays");
  var elHours = document.getElementById("cdHours");
  var elMins = document.getElementById("cdMins");
  var elSecs = document.getElementById("cdSecs");
  var box = document.getElementById("countdown");
  var msg = document.getElementById("countdownMsg");

  if (!elDays) return; // markup not present

  function two(n) { return String(n).padStart(2, "0"); }

  function tick() {
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      // On or after the day
      box.classList.add("is-done");
      elDays.textContent = "0";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      if (msg) msg.innerHTML = "Today is the day \u2014 we're getting married! <span class=\"cd-heart\">&#10084;</span>";
      clearInterval(timer);
      return;
    }

    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / 86400);
    var hours = Math.floor((s % 86400) / 3600);
    var mins = Math.floor((s % 3600) / 60);
    var secs = s % 60;

    elDays.textContent = String(days);
    elHours.textContent = two(hours);
    elMins.textContent = two(mins);
    elSecs.textContent = two(secs);

    if (msg && days > 0) {
      msg.innerHTML = "until we say \u201CI do\u201D <span class=\"cd-heart\">&#10084;</span>";
    } else if (msg) {
      msg.innerHTML = "Almost time \u2014 see you today! <span class=\"cd-heart\">&#10084;</span>";
    }
  }

  tick();
  var timer = setInterval(tick, 1000);
})();
