/* ============================================================
   HATCHLINE — Extensions data
   ------------------------------------------------------------
   This is the ONLY file you need to touch to:
     - change any text, price, or feature on the site
     - add a brand-new extension to the marketplace

   See README.md → "Adding a new extension" for the exact steps.
   Both index.html and extension.html read from this file - you
   never need to edit their HTML directly for routine changes.
   ============================================================ */

const HATCHLINE_EXTENSIONS = [
  {
    // URL: extension.html?slug=bulk-export
    slug: "bulk-export",
    name: "Bulk Export",
    tagline: "Every sheet. Every format. One export.",
    category: "Batch Export & Documentation",
    initials: "BE",
    heroEyebrowTag: "PyRevit Extension",
    heroEyebrowLabel: "Sheet Export Automation",
    shortDescription: "Batches PDF, DWG, DWF, IFC and image exports out of Revit in a single pass — with real DWG export setups, a parameter-driven filename builder, and profiles your whole team can share.",
    longIntro: "Bulk Export batches PDF, DWG, DWF, IFC and image exports straight out of Revit — one run instead of six dialogs. Built as a fast, customizable extension for teams who want more control than a single-format export gives them.",

    badges: ["PDF", "DWG", "DWF", "IFC", "IMG"],

    developer: {
      name: "Sri Ram",
      role: "BIM/MEP Coordination · pyRevit Developer",
      email: "sreeram14092002@gmail.com",
      quote: "Bulk Export started as an internal tool for coordinating multi-discipline sheet sets on live MEP projects — one export run instead of the six I used to run by hand."
    },

    compatibility: "Revit 2022+ (PDF export requires the API introduced in 2022). DWG/DWF/Image export supported further back. Runs as a pyRevit extension — pyRevit must already be installed.",

    comparison: [
      { capability: "Formats per run", manual: "One dialog, one format at a time", tool: "PDF, DWG, DWF, IFC, IMG in one pass" },
      { capability: "File naming", manual: "Manual rename after export", tool: "Built from sheet/project parameters automatically" },
      { capability: "DWG export setup", manual: "Re-selected every time", tool: "Pulled from your model's saved setups" },
      { capability: "Team consistency", manual: "Depends on who ran it", tool: "Shared XML profile, same settings for everyone" },
      { capability: "Run reporting", manual: "No log — failures go unnoticed", tool: "Pass/fail summary per sheet, every run" }
    ],

    features: [
      { tag: "01 — FORMATS", title: "Multi-format batch export", body: "PDF, DWG, DWF, IFC and Images in one configured run, exported per-sheet or combined depending on the format." },
      { tag: "02 — NAMING", title: "Parameter-driven filename builder", body: "Pick any sheet or project parameter, arrange the order, set a separator. The file name is built automatically — no renaming after the fact." },
      { tag: "03 — CAD", title: "Real DWG export setups", body: "Reads the DWG export setups already saved in your model, so your CAD team gets the layer mapping it already expects." },
      { tag: "04 — TEAM", title: "Shareable XML profiles", body: "Save an export configuration once, hand the file to your team, and everyone exports sheets the same way — every time." },
      { tag: "05 — WORKFLOW", title: "Selection → Format → Create", body: "Sheet picking, format settings and output live in separate tabs, so a big export run never turns into one overwhelming dialog." },
      { tag: "06 — REPORTING", title: "Clear run reports", body: "Every export ends with a pass/fail count per sheet, so one failed PDF in a batch of 200 doesn't disappear silently." }
    ],

    workflow: [
      { num: "01 — SELECTION", title: "Pick the sheets", body: "Filter by number or name, then select everything or just this discipline's set. Select All / Select None handle the rest." },
      { num: "02 — FORMAT", title: "Turn on your formats", body: "Tick PDF, DWG, DWF, IFC or Images and only the settings that apply to that format appear — paper size and orientation for PDF, export setup for DWG." },
      { num: "03 — CREATE", title: "Name, choose, export", body: "Build the file name from parameters, pick the output folder, and run the whole batch. A progress bar and summary track every sheet." }
    ],

    pricing: {
      model: "One-time purchase",
      inr: 70,
      aed: 2.69,
      note: "Launch pricing — subject to change as the tool matures. Existing buyers keep their license regardless of future price changes.",
      includes: [
        "Full extension, one Revit login",
        "Filename builder + DWG export setups",
        "Shareable XML profiles",
        "Email support"
      ]
    },

    faq: [
      { q: "Which Revit versions are supported?", a: "PDF export requires Revit 2022 or newer — that's when Autodesk added a native PDF export API. DWG, DWF and image export go back further. 2024–2026 are fully tested; 2027 moved to .NET 10 with some API cleanup, so test on a sandbox project first on that version." },
      { q: "Does NWC export work out of the box?", a: "NWC export needs the separate Navisworks Exporter for Revit add-in installed — that's an Autodesk requirement, not a Bulk Export limitation. It's off by default and gated behind an explicit switch so it never runs by accident." },
      { q: "What about DGN export?", a: "Revit's public API has no DGN export class at all, so it isn't available for automation here. DGN still has to be exported manually through Revit's own File > Export menu." },
      { q: "Can my whole team use the same export settings?", a: "Yes — save your configuration as an XML profile and export it to a shared drive or send it directly. Teammates import it and get the identical setup, including naming pattern and DWG export setup choice." },
      { q: "Do I need anything besides Revit installed?", a: "Yes — Bulk Export runs as a pyRevit extension, so pyRevit needs to be installed first. Mention that when you request access and we'll walk through setup." }
    ]
  }

  // ---- Add your next extension below as a new object ----
  // Copy the object above, change every field, give it a new
  // unique "slug", and it will automatically appear on the
  // homepage and get its own detail page at
  // extension.html?slug=your-slug
];
