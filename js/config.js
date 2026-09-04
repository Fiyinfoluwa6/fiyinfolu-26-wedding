/*
 * SITE CONFIG
 * ---------------------------------------------------------------------------
 * After you set up the Google Sheet (see SETUP-GOOGLE-SHEET.md), paste your
 * Apps Script Web App URL between the quotes below. It looks like:
 *   https://script.google.com/macros/s/AKfy...../exec
 *
 * Until you paste it, the site still works and shows guests their card —
 * it just won't save names to your sheet yet.
 */
window.WEDDING_CONFIG = {
  // Paste your Google Apps Script Web App URL here:
  sheetUrl: "https://script.google.com/macros/s/AKfycbwRtSCoDETky3u7IOrpzV-6mJKrYDmLyqQeqrJx3QyRQxdBnNiRDpfFPS-eN8cHReKJQQ/exec",

  // The image used as the card. Your uploaded flyer:
  imagePath: "assets/invitation.jpeg",

  // Prefix shown on each guest's card code, e.g. FF26-7KQP
  codePrefix: "FF26-"
};
