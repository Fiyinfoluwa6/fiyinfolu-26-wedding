(function () {
  "use strict";

  var IMAGE_PATH = "assets/invitation.jpg"; // drop the real card here to use it

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

  // ---- Guest list ---------------------------------------------------------
  var GUESTS = window.WEDDING_GUESTS || { cardPrefix: "FF26-", approvedNames: [], codes: [] };
  var CARD_PREFIX = GUESTS.cardPrefix || "FF26-";

  function pad4(n) { return String(n).padStart(4, "0"); }
  function normCode(s) { return s.toUpperCase().replace(/[^A-Z0-9]/g, ""); }
  function normName(s) { return s.trim().toLowerCase().replace(/\s+/g, " "); }
  function titleCase(str) {
    return str.replace(/\S+/g, function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  }

  // Build lookup tables: input -> { number, name }
  var codeMap = {};
  (GUESTS.codes || []).forEach(function (code, i) {
    codeMap[normCode(code)] = { number: CARD_PREFIX + pad4(i + 1), name: "" };
  });

  var nameMap = {};
  var offset = (GUESTS.codes || []).length;
  (GUESTS.approvedNames || []).forEach(function (nm, j) {
    nameMap[normName(nm)] = { number: CARD_PREFIX + pad4(offset + j + 1), name: titleCase(nm) };
  });

  function lookup(raw) {
    var byCode = codeMap[normCode(raw)];
    if (byCode) return byCode;
    var byName = nameMap[normName(raw)];
    if (byName) return byName;
    return null;
  }

  // ---- Try to load the couple's real invitation image ---------------------
  var probe = new Image();
  probe.onload = function () {
    cardImg.src = IMAGE_PATH;
    cardImg.classList.add("is-visible");
    cardFallback.classList.add("is-hidden");
  };
  probe.onerror = function () { /* keep the CSS recreation */ };
  probe.src = IMAGE_PATH + "?v=" + Date.now();

  // ---- Generate -----------------------------------------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = input.value.trim();
    if (!raw) {
      showError("Please enter your invitation code first.");
      return;
    }

    var match = lookup(raw);
    if (!match) {
      showError("That code isn't recognised. Please check your invitation and try again.");
      return;
    }

    hint.classList.remove("is-error");
    hint.textContent = "Tip: the same code always gives you the same card number.";

    currentSerial = match.number;
    stampNumber.textContent = currentSerial;
    stampName.textContent = match.name || "";

    stage.hidden = false;
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function showError(msg) {
    hint.textContent = msg;
    hint.classList.add("is-error");
    stage.hidden = true;
    input.focus();
    input.select();
  }

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
