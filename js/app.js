(function () {
  "use strict";

  var CFG = window.WEDDING_CONFIG || {};
  var IMAGE_PATH = CFG.imagePath || "assets/invitation.jpeg";
  var SHEET_URL = CFG.sheetUrl || "";
  var CODE_PREFIX = CFG.codePrefix || "FF26-";
  var LS_KEY = "ff26_submitted_names"; // same-device duplicate guard

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
  var saveNote = document.getElementById("saveNote");

  var currentSerial = "";
  var currentName = "";

  // ---- Helpers ------------------------------------------------------------
  function normName(s) { return s.trim().toLowerCase().replace(/\s+/g, " "); }
  function titleCase(str) {
    return str.trim().replace(/\s+/g, " ").replace(/\S+/g, function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  }

  // Deterministic code from the name: same name -> same code, always.
  function codeForName(name) {
    var key = normName(name);
    var h = 0x811c9dc5; // FNV-1a
    for (var i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    var alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
    var out = "";
    var v = h >>> 0;
    for (var j = 0; j < 4; j++) { out += alphabet[v % alphabet.length]; v = Math.floor(v / alphabet.length) + 7; }
    return CODE_PREFIX + out;
  }

  function getLocalNames() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function rememberLocalName(n) {
    var arr = getLocalNames();
    if (arr.indexOf(n) === -1) { arr.push(n); }
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  // ---- Load the real invitation image -------------------------------------
  var probe = new Image();
  probe.onload = function () {
    cardImg.src = IMAGE_PATH;
    cardImg.classList.add("is-visible");
    cardFallback.classList.add("is-hidden");
  };
  probe.onerror = function () { /* keep CSS recreation */ };
  probe.src = IMAGE_PATH + "?v=" + Date.now();

  // ---- Save to Google Sheet -----------------------------------------------
  function saveToSheet(name, code) {
    if (!SHEET_URL) return; // not configured yet
    var payload = new URLSearchParams();
    payload.set("name", name);
    payload.set("code", code);
    payload.set("ts", new Date().toISOString());
    // no-cors form post -> works with Apps Script without CORS headaches
    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    }).catch(function () { /* best-effort; guest still gets their card */ });
  }

  // ---- Generate -----------------------------------------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = input.value.trim();
    if (!raw) {
      showError("Please enter your name first.");
      return;
    }
    if (raw.replace(/[^a-zA-Z]/g, "").length < 2) {
      showError("Please enter your real name so security can find you on the list.");
      return;
    }

    var pretty = titleCase(raw);
    var key = normName(raw);

    // Same-device duplicate soft-warning
    if (getLocalNames().indexOf(key) !== -1) {
      hint.classList.remove("is-error");
      hint.textContent = "You've already generated a card for this name — here it is again.";
    } else {
      hint.classList.remove("is-error");
      hint.textContent = "Please enter your name exactly as you'd like it shown at the entrance.";
    }

    currentName = pretty;
    currentSerial = codeForName(raw);
    stampName.textContent = pretty;
    stampNumber.textContent = currentSerial;

    // Save + remember
    if (getLocalNames().indexOf(key) === -1) {
      saveToSheet(pretty, currentSerial);
      rememberLocalName(key);
    }

    if (saveNote) {
      saveNote.textContent = SHEET_URL
        ? "Your name has been recorded. Present this card (or a screenshot) at the entrance."
        : "Screenshot or download this card and present it at the entrance.";
    }

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

  // ---- Enter a different name --------------------------------------------
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
        var safe = currentName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        link.download = "wedding-card-" + safe + ".png";
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
