(function () {
  "use strict";

  // ---- Config -------------------------------------------------------------
  var PREFIX = "FF26-";              // shows on the card: FF26-0473
  var IMAGE_PATH = "assets/invitation.jpg"; // drop the real card here to use it
  var SERIAL_SPACE = 9000;           // numbers land in 1000..9999 range

  // ---- Elements -----------------------------------------------------------
  var form = document.getElementById("codeForm");
  var input = document.getElementById("codeInput");
  var hint = document.getElementById("entryHint");
  var stage = document.getElementById("cardStage");
  var card = document.getElementById("card");
  var cardImg = document.getElementById("cardImg");
  var cardFallback = document.getElementById("cardFallback");
  var stampNumber = document.getElementById("stampNumber");
  var stampName = document.getElementById("stampName");
  var downloadBtn = document.getElementById("downloadBtn");
  var againBtn = document.getElementById("againBtn");

  var currentSerial = "";

  // ---- Try to load the couple's real invitation image ---------------------
  // If assets/invitation.jpg exists it is used; otherwise the CSS recreation
  // stays visible. Either way the number stamp is overlaid on top.
  var probe = new Image();
  probe.onload = function () {
    cardImg.src = IMAGE_PATH;
    cardImg.classList.add("is-visible");
    cardFallback.classList.add("is-hidden");
  };
  probe.onerror = function () {
    // keep the CSS recreation
  };
  probe.src = IMAGE_PATH + "?v=" + Date.now();

  // ---- Deterministic serial number from a code ----------------------------
  // Same code -> same number, always. Different codes -> (almost always)
  // different numbers. Fully client-side, no server needed.
  function hashString(str) {
    // FNV-1a 32-bit hash
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h >>> 0;
  }

  function normalize(code) {
    return code.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function serialFor(code) {
    var h = hashString(normalize(code));
    var n = (h % SERIAL_SPACE) + 1000; // 1000..9999
    return PREFIX + String(n).padStart(4, "0");
  }

  function titleCase(str) {
    return str.replace(/\S+/g, function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  }

  // ---- Generate ----------------------------------------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var code = input.value.trim();
    if (!code) {
      hint.textContent = "Please enter your invitation code first.";
      hint.classList.add("is-error");
      input.focus();
      return;
    }
    hint.classList.remove("is-error");
    hint.textContent = "Tip: the same code always gives you the same card number.";

    currentSerial = serialFor(code);
    stampNumber.textContent = currentSerial;

    // If the code looks like a name, show it on the card for a nicer keepsake.
    if (/[a-zA-Z]/.test(code) && code.length <= 34) {
      stampName.textContent = titleCase(code);
    } else {
      stampName.textContent = "";
    }

    stage.hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---- Enter a different code --------------------------------------------
  againBtn.addEventListener("click", function () {
    stage.hidden = true;
    input.value = "";
    input.focus();
    document.getElementById("entry").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // ---- Download as image --------------------------------------------------
  downloadBtn.addEventListener("click", function () {
    var original = downloadBtn.textContent;
    downloadBtn.textContent = "Preparing…";
    downloadBtn.disabled = true;

    html2canvas(card, {
      backgroundColor: null,
      scale: Math.min(3, (window.devicePixelRatio || 1) * 2),
      useCORS: true,
      logging: false
    })
      .then(function (canvas) {
        var link = document.createElement("a");
        link.download = "wedding-card-" + currentSerial + ".png";
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function () {
        alert("Could not auto-download. Please take a screenshot of your card instead.");
      })
      .finally(function () {
        downloadBtn.textContent = original;
        downloadBtn.disabled = false;
      });
  });
})();
