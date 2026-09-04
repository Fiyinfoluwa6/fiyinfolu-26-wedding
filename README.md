# Folusho & Fiyinfoluwa — Wedding Admit Card Generator

A simple, static website for the wedding of **Folusho & Fiyinfoluwa** on **October 10th, 2026** in Lagos.

Guests enter an **invitation code**, and the site instantly generates a **unique card number** stamped onto the invitation. Guests can then **download the card as an image** or **screenshot** it and present the number at the door (*Card Admits One*).

## 🔗 Live site

**https://fiyinfoluwa6.github.io/fiyinfolu-26-wedding/**

## How it works

- A guest types either their **approved name** or the **unique invite code** they were given.
- If it's on the guest list, the site shows a fixed card number like `FF26-0042` stamped on the invitation.
- Anything **not** on the list is rejected ("That code isn't recognised…"), so outsiders can't generate a card.
- The **same code always produces the same number**, so re-entering is safe.
- Everything runs in the browser — **no server, no database, no cost**.

## Managing invite codes

Two ways for a guest to get a card (both controlled):

1. **Unique invite codes** — one per guest, e.g. `WED-7KQP`. Codes live in `js/guests.js`.
2. **Approved names** — add invited guests' full names to the `approvedNames` list in `js/guests.js`, and they can just type their name.

### Generate / regenerate codes

```bash
node scripts/generate-guests.js 150   # make 150 codes (change the number)
```

This writes three files:
- `js/guests.js` — the list the live site checks against
- `CODES.md` — a copy-paste table of **Card No. + Invite Code**
- `codes.html` — a **printable** sheet (open it and click Print) with a blank column to write each guest's name

> ⚠️ Re-running the generator creates a **fresh** set — previously handed-out codes stop working.

### Add named guests

Edit `js/guests.js` and fill in `approvedNames`, e.g.:

```js
approvedNames: ["Ada Obi", "Tunde Bello"],
```

Commit & push — changes go live in about a minute.

## Using YOUR actual invitation image (recommended)

The site ships with a styled recreation of the invitation so it works right away.
To stamp the number onto your **real** invitation flyer instead:

1. Save your invitation image as **`invitation.jpg`**.
2. Put it in the **`assets/`** folder (path: `assets/invitation.jpg`).
3. Commit & push. The site will automatically use it — no code changes needed.

> Best results with a portrait image around **1000×1400px**. The number badge sits near the bottom of the card.

## Project structure

```
fiyinfolu-26-wedding/
├── index.html        # page + card markup
├── css/style.css     # blue floral styling
├── js/app.js         # code → number logic + download
├── assets/           # put invitation.jpg here (optional)
└── README.md
```

## Local preview

Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Hosted with **GitHub Pages** from the `main` branch. Any push to `main` updates the live site within a minute.
