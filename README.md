# Hatchline — pyRevit extension marketplace

This is a real, deployable static website (no build step, no server
required). It currently lists one extension — **Bulk Export**.

## The easy way to make changes — no coding

Open **`editor.html`** in your browser (works locally by double-clicking
the file, or on your live site at `yoursite.com/editor.html`).

- **To edit Bulk Export** (change its price, description, features,
  FAQ, anything): pick it from the "Load existing extension" dropdown
  at the top, click **Load into form**, change whatever you want in
  the boxes, then click **Generate Code** at the bottom.
- **To add a brand-new extension**: leave the dropdown on "Create new"
  and fill in the form from scratch, then **Generate Code**.

Either way, you end up with a block of text in the black box at the
bottom. Click **Copy to clipboard**, then follow the on-screen
instructions (also repeated below) for where to paste it in
`extensions-data.js` on GitHub. Commit the change, and the live site
updates automatically within a minute or two — no separate deploy step.

**This one page (`editor.html`) is the only thing you need to open for
routine updates.** It is not linked from the public site's navigation
on purpose — it's a tool for you, not visitors — but it's not
password-protected, so don't put anything truly secret in mind when
using it (see "Things to know" at the bottom).

### Even simpler: changing just the price

If all you want to do is change a price, you don't even need the
editor. On GitHub, open `assets/js/extensions-data.js`, click the
pencil (✎) icon to edit, find:
```js
pricing: {
  model: "One-time purchase",
  inr: 70,
  aed: 2.69,
```
Change the two numbers, commit. That's the entire process for a price
change.

---

## The "Download" button — how it actually works

The pricing section's button no longer sends an email. It now:
1. Opens a form requiring **name, email, company, and country** (all
   mandatory — the form won't submit without every field filled).
2. Sends those details somewhere you can see them (see below).
3. Only then downloads the real file from `downloads/bulk-export.zip`.

### Where the lead details go — you need to do this one step

This is a static site with no server, so "submit a form" needs
somewhere external to actually land. Recommended: **Formspree** (free
tier is plenty to start):

1. Go to **formspree.io** → sign up free → **New Form**.
2. Copy the endpoint URL it gives you — looks like
   `https://formspree.io/f/abcd1234`.
3. Open `assets/js/lead-capture.js`, find this line near the top:
   ```js
   var FORMSPREE_ENDPOINT = "PASTE_YOUR_FORMSPREE_ENDPOINT_HERE";
   ```
4. Replace the placeholder text with your real endpoint, save, commit.

That's it — every submission now lands in your Formspree dashboard, and
Formspree emails you a copy of each one by default too.

**Until you do that step**, the download button still works — it
automatically falls back to opening the visitor's email app with their
details pre-filled, addressed to you. That fallback is better than
nothing but unreliable (some visitors, especially on phones or work
computers, don't have an email app configured, so you'd never see those
submissions). Setting up Formspree properly takes about two minutes and
fixes that.

### Uploading the actual file people download

The zip file lives at `downloads/bulk-export.zip` in this project —
that's the real file people receive. To update it when you release a
new version of the extension:
1. Build the new zip.
2. On GitHub, go to the `downloads` folder → upload the new file with
   the **exact same name** (`bulk-export.zip`), which overwrites the
   old one.
3. Commit. The download button doesn't need any other changes — it
   always points at that same file path.

If you add a new extension via the editor, give it its own file (e.g.
`downloads/your-extension.zip`) and put that same path in the
extension's "Download file path" field in `editor.html`.

---

## Contact page

`contact.html` is a real page (not a mailto link) with:
- Your email and role shown directly
- A form (name, email, message type, message) that submits to the
  same Formspree endpoint as the download form, tagged with a
  different subject line so you can tell them apart in your inbox —
  "Hatchline Contact - Complaint - ..." vs "Hatchline download - ...".

Both the download form and this contact form read the endpoint from
one shared file: `assets/js/config.js`. If you ever need to change
your Formspree endpoint, that's the only place to update it.

---

## File map

```
hatchline/
├── index.html              ← homepage (extension grid)
├── extension.html          ← detail page template (reads ?slug=...)
├── contact.html             ← contact page + feedback/complaint form
├── editor.html              ← ⭐ NO-CODE EDITOR — open this to make changes ⭐
├── downloads/
│   └── bulk-export.zip      ← the actual file customers download
└── assets/
    ├── css/style.css       ← all styling, shared by all pages
    ├── js/config.js         ← Formspree endpoint (shared by download + contact forms)
    ├── js/extensions-data.js  ← the file editor.html reads/writes
    ├── js/detail.js         ← renders extension.html from the data file
    ├── js/lead-capture.js   ← the download-gate form
    ├── js/contact.js         ← the contact page's form handler
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
