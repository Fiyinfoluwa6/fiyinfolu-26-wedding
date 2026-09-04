# 📋 Set up your guest list (Google Sheet) — 5 minutes, one time

This connects the wedding site to a **Google Sheet you own**, so every guest who
generates a card is automatically saved. You can open, print, and download that
list any time before the wedding to give to your security/bouncers.

You do this **once**. No coding needed — just copy & paste.

---

## Step 1 — Create the Sheet
1. Go to **https://sheets.google.com** and click **Blank spreadsheet**.
2. Rename it (top-left) to something like **“Wedding Guest List”**.

## Step 2 — Open the Script editor
1. In the sheet menu, click **Extensions → Apps Script**.
2. Delete anything shown in the editor.
3. Open the file **`google-apps-script/Code.gs`** from this project, copy **all** of it,
   and paste it into the Apps Script editor.
4. Click the **💾 Save** icon.

## Step 3 — Deploy it as a Web App
1. Click **Deploy → New deployment**.
2. Click the **⚙️ gear** next to “Select type” and choose **Web app**.
3. Set:
   - **Description:** `wedding recorder`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**   ← important, so guests can submit
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google account, and allow it.
   (If you see “Google hasn’t verified this app”, click **Advanced → Go to … (unsafe)** —
   it’s your own script, it’s safe.)
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb....../exec`

## Step 4 — Paste the URL into the site
1. Open **`js/config.js`** in this project.
2. Put your URL between the quotes on the `sheetUrl` line:
   ```js
   sheetUrl: "https://script.google.com/macros/s/AKfycb....../exec",
   ```
3. Save, commit, and push (or tell me and I’ll push it for you).

**Done!** Every guest who enters their name will now appear in your Sheet on a
tab called **“Guests”**, with columns: **Timestamp · Name · Code · Checked In**.

---

## How to use the list before the wedding
- Open your Google Sheet any time to see everyone who has generated a card.
- **Download for security:** in the Sheet, **File → Download → PDF** (nice to print)
  or **Microsoft Excel (.xlsx)** / **CSV**.
- The **“Checked In”** column is blank for you or your team to tick off on the day.

## Notes
- **Duplicate names are ignored** — if someone enters a name already on the list,
  it won’t be added twice (they still see their card).
- If you ever redeploy, use **Deploy → Manage deployments → Edit** and keep the
  **same** URL so you don’t have to update `config.js` again.
