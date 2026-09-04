#!/usr/bin/env node
/*
 * Generates unique invite codes for the wedding and writes:
 *   - js/guests.js   (used by the live site to validate codes)
 *   - CODES.md       (plain list you can copy/paste to share)
 *   - codes.html     (printable lookup sheet: card number + code)
 *
 * Usage:
 *   node scripts/generate-guests.js [count]
 *   e.g.  node scripts/generate-guests.js 200
 *
 * NOTE: running this REGENERATES the codes (old ones stop working).
 * Only run it again if you want a fresh set.
 */

const fs = require("fs");
const path = require("path");

const COUNT = parseInt(process.argv[2], 10) || 150;
const CODE_PREFIX = "WED-";     // guests type this (e.g. WED-7KQP)
const CARD_PREFIX = "FF26-";    // shows on the card    (e.g. FF26-0042)

// Unambiguous alphabet: no 0/O, 1/I/L to avoid confusion when read aloud.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomCode() {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return CODE_PREFIX + s;
}

// Build a unique set of codes
const codes = [];
const seen = new Set();
while (codes.length < COUNT) {
  const c = randomCode();
  if (!seen.has(c)) {
    seen.add(c);
    codes.push(c);
  }
}

// ---- js/guests.js ----------------------------------------------------------
const guestsJs = `/*
 * Guest access list for the wedding site.
 * -------------------------------------------------------------------------
 * Two ways a guest can get their card:
 *   1) Type their APPROVED NAME (add names to approvedNames below), OR
 *   2) Type their unique INVITE CODE (generated list below).
 * Anything not on these lists is rejected.
 *
 * To ADD named guests, put full names in the approvedNames array, e.g.:
 *     approvedNames: ["Ada Obi", "Tunde Bello"],
 * (Regenerate codes with: node scripts/generate-guests.js <count>)
 */
window.WEDDING_GUESTS = {
  cardPrefix: "${CARD_PREFIX}",

  // Named guests may type their name to receive a card. Add names here:
  approvedNames: [
    // "Full Name Here",
  ],

  // Unique invite codes (one per guest). Give one code to each guest.
  codes: [
${codes.map((c) => `    "${c}"`).join(",\n")}
  ]
};
`;

// ---- CODES.md --------------------------------------------------------------
let md = `# Invite Codes — Folusho & Fiyinfoluwa (10.10.2026)\n\n`;
md += `Give **one code per guest**. When they enter it on the site they get the matching card number.\n\n`;
md += `Total codes: **${codes.length}**\n\n`;
md += `| Card No. | Invite Code |\n|---------|-------------|\n`;
codes.forEach((c, i) => {
  const card = CARD_PREFIX + String(i + 1).padStart(4, "0");
  md += `| ${card} | ${c} |\n`;
});
md += `\n> Assign these to guests as you hand them out (write the guest's name next to the code you gave them).\n`;

// ---- codes.html (printable) ------------------------------------------------
let rows = codes
  .map((c, i) => {
    const card = CARD_PREFIX + String(i + 1).padStart(4, "0");
    return `      <tr><td>${card}</td><td class="code">${c}</td><td class="who"></td></tr>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invite Codes · Folusho & Fiyinfoluwa</title>
<style>
  body { font-family: Georgia, serif; color: #26304a; margin: 32px; }
  h1 { color: #2b3a67; }
  p.sub { color: #5a6480; }
  table { border-collapse: collapse; width: 100%; max-width: 640px; }
  th, td { border: 1px solid #c7cfe4; padding: 8px 12px; text-align: left; }
  th { background: #2b3a67; color: #fff; }
  td.code { font-family: "Courier New", monospace; font-weight: bold; letter-spacing: 1px; }
  td.who { width: 200px; }
  tr:nth-child(even) { background: #f2f4fb; }
  @media print { body { margin: 0; } .noprint { display: none; } }
  button { margin-bottom: 18px; padding: 8px 16px; cursor: pointer; }
</style>
</head>
<body>
  <h1>Invite Codes — Folusho &amp; Fiyinfoluwa</h1>
  <p class="sub">October 10th, 2026 · Total codes: ${codes.length}. Give one code per guest and note who received it.</p>
  <button class="noprint" onclick="window.print()">🖨️ Print this sheet</button>
  <table>
    <thead><tr><th>Card No.</th><th>Invite Code</th><th>Guest name</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
</body>
</html>
`;

const root = path.resolve(__dirname, "..");
fs.mkdirSync(path.join(root, "js"), { recursive: true });
fs.writeFileSync(path.join(root, "js", "guests.js"), guestsJs);
fs.writeFileSync(path.join(root, "CODES.md"), md);
fs.writeFileSync(path.join(root, "codes.html"), html);

console.log(`Generated ${codes.length} codes.`);
console.log("Wrote: js/guests.js, CODES.md, codes.html");
