# Folusho & Fiyinfoluwa — Wedding Admit Card Generator

A simple, static website for the wedding of **Folusho & Fiyinfoluwa** on **October 10th, 2026** in Lagos.

Guests enter an **invitation code**, and the site instantly generates a **unique card number** stamped onto the invitation. Guests can then **download the card as an image** or **screenshot** it and present the number at the door (*Card Admits One*).

## 🔗 Live site

**https://fiyinfoluwa6.github.io/fiyinfolu-26-wedding/**

## How it works

- A guest types any code they were given (a passcode, or even their name).
- The site turns that code into a fixed serial number like `FF26-0473`.
- The **same code always produces the same number**, so re-entering it is safe and there are no duplicates for different codes.
- Everything runs in the browser — **no server, no database, no cost**.

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
