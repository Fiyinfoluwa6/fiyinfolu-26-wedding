/**
 * Wedding RSVP / Admit-card recorder — Google Apps Script
 * ---------------------------------------------------------------------------
 * This runs inside YOUR Google account and saves each guest's name + code
 * into a Google Sheet you own. Follow SETUP-GOOGLE-SHEET.md to deploy it.
 *
 * It appends a row: [Timestamp, Name, Code] and avoids duplicate names
 * (case-insensitive). Existing names are ignored so the list stays clean.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid double-writes if two people submit at once
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Guests")
             || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Guests");

    // Ensure header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Code", "Checked In"]);
    }

    var params = (e && e.parameter) ? e.parameter : {};
    var name = (params.name || "").toString().trim();
    var code = (params.code || "").toString().trim();
    var ts   = (params.ts   || new Date().toISOString()).toString();

    if (!name) {
      return json({ ok: false, error: "missing name" });
    }

    // De-dupe by lowercased name
    var normNew = name.toLowerCase().replace(/\s+/g, " ");
    var last = sheet.getLastRow();
    if (last >= 2) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getValues(); // column B (Name)
      for (var i = 0; i < existing.length; i++) {
        var normOld = (existing[i][0] || "").toString().toLowerCase().replace(/\s+/g, " ");
        if (normOld === normNew) {
          return json({ ok: true, duplicate: true, name: name });
        }
      }
    }

    sheet.appendRow([ts, name, code, ""]);
    return json({ ok: true, name: name, code: code });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the Web App URL in a browser to confirm it's live.
function doGet() {
  return json({ ok: true, message: "Wedding recorder is live. Use POST to add guests." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
