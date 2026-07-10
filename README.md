# Hatchline — pyRevit extension marketplace

This is a real, deployable static website (no build step, no server
required). It currently lists one extension — **Bulk Export**.

## File map

```
hatchline/
├── index.html              ← homepage (extension grid)
├── extension.html          ← detail page template (reads ?slug=...)
└── assets/
    ├── css/style.css       ← all styling, shared by both pages
    ├── js/extensions-data.js  ← ⭐ THE FILE YOU EDIT ⭐
    ├── js/detail.js         ← renders extension.html from the data file
    └── img/                 ← icons/images
```

---

## Making this a live website

Pick any of these — all are free for a static site like this:

### Option A — GitHub Pages (recommended, free, your own domain later)
1. Create a new GitHub repository (e.g. `hatchline`).
2. Upload this whole `hatchline` folder's contents to the repo root.
3. Repo → **Settings → Pages** → Source: `main` branch, `/root`.
4. Your site goes live at `https://yourusername.github.io/hatchline/`
   within a minute or two.
5. To use your own domain later: buy a domain, add a `CNAME` file with
   the domain name in the repo root, and point the domain's DNS at
   GitHub Pages (GitHub's Pages settings screen gives you the exact
   records to add).

### Option B — Netlify (drag-and-drop, fastest to try)
1. Go to netlify.com, sign up free.
2. Drag the `hatchline` folder directly onto the Netlify dashboard.
3. It's live immediately at a `*.netlify.app` URL. You can attach a
   custom domain in Site Settings → Domain Management.

### Option C — Vercel
Same idea as Netlify: `vercel.com` → New Project → drag and drop the
folder, or connect the GitHub repo from Option A.

**Any of these work** — pick whichever feels easiest. GitHub Pages is
the best long-term choice if you're already using GitHub, since every
edit is just a `git push`.

---

## Making changes YOURSELF (no need to come back and ask each time)

This site was deliberately built **data-driven**, so almost everything
you'll want to change lives in one file:

### `assets/js/extensions-data.js`

This is a plain JavaScript file containing one big list of extensions.
Every price, feature, FAQ answer, and piece of copy on both the
homepage and the detail pages comes from here. **You never need to
touch the HTML files for routine changes.**

**To change Bulk Export's price:**
Open `extensions-data.js`, find:
```js
pricing: {
  model: "One-time purchase",
  inr: 70,
  aed: 2.69,
  ...
```
Change the numbers. Save. Refresh the page. Done — the homepage card
and the detail page pricing block both update automatically.

**To change any text** (tagline, feature descriptions, FAQ answers,
your bio quote, etc.): find the matching field in the same object and
edit the text between the quotes. Keep the quotes and commas exactly
where they are.

**To add a brand-new extension:**
1. Open `extensions-data.js`.
2. Copy the entire `{ ... }` block for Bulk Export (from `{` to the
   matching `}`).
3. Paste it right after, before the closing `];`.
4. Change every field — most importantly:
   - `slug`: a unique, URL-safe id, e.g. `"sheet-renamer"` (lowercase,
     hyphens, no spaces)
   - `name`, `tagline`, `category`, `initials` (2 letters shown on the
     card icon)
   - `pricing.inr` / `pricing.aed`
   - `features`, `workflow`, `faq` — arrays, add/remove entries by
     copying one `{...}` line inside the array and editing it
5. Save the file. Reload `index.html` — the new extension appears on
   the homepage automatically, and its detail page works immediately
   at `extension.html?slug=your-slug` with zero HTML editing.

That's the entire workflow for 90% of future changes. If you ever want
a structural change — a new section type, a different layout, a real
payment gateway instead of the `mailto:` buy buttons — that's a good
time to come back and ask, since that touches the HTML/CSS/JS logic
itself rather than just content.

---

## Things to know

- **No payment processing.** "Buy now" and "Request access" buttons
  open a pre-filled email — there's no shopping cart or automated
  checkout. That's a deliberate choice for now (no backend to build,
  host, or secure) but can be added later (Stripe, Razorpay, Gumroad,
  Lemon Squeezy, etc. are the usual options that also handle
  INR/AED/USD conversion automatically for you).
- **Pricing display is informational.** AED figures are a reference
  estimate off the INR price, not a live currency feed. Update them by
  hand when you change the INR price.
- **This is not affiliated with Autodesk.** The footer disclaimer
  exists intentionally — keep it if you add more Autodesk-adjacent
  products.
