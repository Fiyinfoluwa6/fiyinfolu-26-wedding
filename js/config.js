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
  sheetUrl: "https://script.google.com/macros/s/AKfycbzHMwFx404gz3xqqGv1hp_K2MH3MFdBuBa3QZPELo8lJ3B3F6QuWneEt7q5RwdYVmPcUw/exec",

  // The image used as the card. Your uploaded flyer:
  imagePath: "assets/invitation.jpeg",

  // Prefix shown on each guest's card code, e.g. FF26-7KQP
  codePrefix: "FF26-"
};
