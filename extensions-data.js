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
    shortDescription: "Batches PDF, DWG, DWF, IFC and image exports out of Revit in a single pass — with real DWG export setups, a parameter-driven filename builder, shareable team profiles, and scheduled/unattended exports via Windows Task Scheduler.",
    longIntro: "Bulk Export batches PDF, DWG, DWF, IFC and image exports straight out of Revit — one run instead of six dialogs. Includes Scheduled Export, so a saved profile can run a full batch export automatically overnight with no one at the keyboard. Built as a fast, customizable extension for teams who want more control than a single-format export gives them.",

    badges: ["PDF", "DWG", "DWF", "IFC", "IMG"],

    version: "1.2",
    changelog: [
      {
        version: "1.2",
        downloadUrl: "downloads/bulk-export-v1.2.zip",
        changes: [
          "Added Scheduled Export — run a full batch export automatically via Windows Task Scheduler, no one has to open Revit or click through the dialog",
          "Fixed a cross-version bug where Zoom % export could silently fail on some Revit versions (Autodesk uses two different, similarly-named enums for the same zoom setting depending on version — both are now tried automatically)",
          "Fixed a paper placement bug where 'Offset from corner' threw an error instead of applying (wrong enum name)",
          "Fixed a profile save crash ('unknown encoding: unicode') on some Revit/IronPython versions",
          "Fixed a crash on Revit 2027 specifically, caused by a .NET interface its newer runtime doesn't resolve the same way",
          "Added a 'Clean .pcp files after export' option for DWG",
          "Added a search box to the filename builder's parameter list"
        ]
      },
      {
        version: "1.1",
        downloadUrl: "downloads/bulk-export-v1.1.zip",
        changes: [
          "Initial public release: batch PDF, DWG, DWF, IFC and Image export in one pass",
          "Parameter-driven filename builder",
          "Real DWG export setups pulled from the model",
          "Shareable XML profiles"
        ]
      }
    ],

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
      { capability: "Run reporting", manual: "No log — failures go unnoticed", tool: "Pass/fail summary per sheet, every run" },
      { capability: "Unattended runs", manual: "Someone has to sit there and click through it", tool: "Scheduled via Windows Task Scheduler — runs overnight, no one watching" }
    ],

    features: [
      { tag: "01 — FORMATS", title: "Multi-format batch export", body: "PDF, DWG, DWF, IFC and Images in one configured run, exported per-sheet or combined depending on the format." },
      { tag: "02 — NAMING", title: "Parameter-driven filename builder", body: "Pick any sheet or project parameter, arrange the order, set a separator. The file name is built automatically — no renaming after the fact." },
      { tag: "03 — CAD", title: "Real DWG export setups", body: "Reads the DWG export setups already saved in your model, so your CAD team gets the layer mapping it already expects." },
      { tag: "04 — TEAM", title: "Shareable XML profiles", body: "Save an export configuration once, hand the file to your team, and everyone exports sheets the same way — every time." },
      { tag: "05 — WORKFLOW", title: "Selection → Format → Create", body: "Sheet picking, format settings and output live in separate tabs, so a big export run never turns into one overwhelming dialog." },
      { tag: "06 — REPORTING", title: "Clear run reports", body: "Every export ends with a pass/fail count per sheet, so one failed PDF in a batch of 200 doesn't disappear silently." },
      { tag: "07 — AUTOMATION", title: "Scheduled / unattended export", body: "Point Windows Task Scheduler at a saved profile and it runs a full batch export automatically — nightly issue sets, no one has to open Revit or click through the dialog." }
    ],

    workflow: [
      { num: "01 — SELECTION", title: "Pick the sheets", body: "Filter by number or name, then select everything or just this discipline's set. Select All / Select None handle the rest." },
      { num: "02 — FORMAT", title: "Turn on your formats", body: "Tick PDF, DWG, DWF, IFC or Images and only the settings that apply to that format appear — paper size and orientation for PDF, export setup for DWG." },
      { num: "03 — CREATE", title: "Name, choose, export", body: "Build the file name from parameters, pick the output folder, and run the whole batch. A progress bar and summary track every sheet." }
    ],

    pricing: {
      model: "Free download",
      free: true,
      inr: 0,
      aed: 0,
      note: "Free during early access. Details are collected only to follow up about updates and support — not for payment.",
      downloadUrl: "downloads/bulk-export-v1.2.zip",
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
      { q: "Can this run automatically without opening Revit?", a: "Yes — Scheduled Export lets you point Windows Task Scheduler at a saved profile and run a full batch export unattended, e.g. every night. There's also a manual \"Scheduled Export\" ribbon button to test your setup with a person watching before trusting it to run on its own." },
      { q: "Do I need anything besides Revit installed?", a: "Yes — Bulk Export runs as a pyRevit extension, so pyRevit needs to be installed first. Mention that when you request access and we'll walk through setup." }
    ]
  },

  {
    // URL: extension.html?slug=rp-tools
    slug: "rp-tools",
    name: "Quick Sheets",
    tagline: "Nine tools. One tab. No more digging through menus.",
    category: "Project Management Toolset",
    initials: "QS",
    heroEyebrowTag: "PyRevit Extension",
    heroEyebrowLabel: "Project Management Automation",
    shortDescription: "A full project-management toolset for Revit — batch export, sheet automation, workset creation, model cleanup, grid tools and element lookup, all in one pyRevit tab.",
    longIntro: "RP Tools packs nine everyday project-management jobs — batch export, sheet creation and renaming, viewport alignment, workset setup, model cleanup, grid flipping and element lookup — into a single \"ProjectManagement\" pyRevit tab, so routine cleanup and setup work stops eating whole afternoons.",

    badges: ["PDF", "DWG", "CSV", "TXT"],

    version: "1.0",

    developer: {
      name: "Ramesh Prakash",
      role: "pyRevit Developer",
      email: "rameshe280@gmail.com",
      quote: "RP Tools grew out of the same handful of setup and cleanup jobs coming up on every project — sheets, worksets, grids, IDs — so I built one tab that handles all of them instead of hunting through five different add-ins."
    },

    compatibility: "Revit 2021–2025 (a few features such as native Purge Unused need Revit 2022+; degrades gracefully on older versions with a message instead of crashing). Runs as a pyRevit extension — pyRevit 4.8+ must already be installed.",

    comparison: [
      { capability: "Sheet creation", manual: "One sheet at a time, manual titleblock + placement", tool: "Bulk-create sheets from selected views with auto-incrementing numbers" },
      { capability: "Sheet renaming", manual: "Manual rename, one sheet at a time", tool: "Find & replace, prefix/suffix, or CSV-mapped rename across many sheets" },
      { capability: "Viewport alignment", manual: "Dragged and eyeballed per sheet", tool: "Align 2+ selected viewports to the first one in one click" },
      { capability: "Worksets", manual: "Typed in one by one via the Worksets dialog", tool: "Created in bulk from a plain .txt list" },
      { capability: "Model cleanup", manual: "Several separate manual passes", tool: "Checklist-driven cleanup covering CAD imports, view templates, rooms, line patterns, group types and Purge Unused" },
      { capability: "Element lookup", manual: "Manual search through the model tree", tool: "Select/zoom by Element ID, host or linked model, with a printed ID/category table" }
    ],

    features: [
      { tag: "01 — EXPORT", title: "Batch Export", body: "Select sheets, choose PDF and/or DWG, pick a naming pattern and combined-or-per-sheet output, and export the whole set with a progress log." },
      { tag: "02 — SHEETS", title: "Sheets From Views", body: "Select views, pick a titleblock and a starting sheet number, and get one sheet per view created automatically, auto-incrementing as it goes." },
      { tag: "03 — SHEETS", title: "Align Viewports", body: "Select two or more viewports on a sheet and align them — left, right, top, bottom, or centered — to the first one you picked." },
      { tag: "04 — SHEETS", title: "Copy/Move Legends & Viewports", body: "Push a legend or viewport to a list of target sheets at the same position, either copying or moving it in one pass." },
      { tag: "05 — SHEETS", title: "Bulk Rename Sheets", body: "Find & replace, add a prefix/suffix, or import a CSV mapping of old numbers to new numbers and names." },
      { tag: "06 — SELECTION", title: "Select By ID", body: "Enter one or more Element IDs from the host or a linked model and the tool selects, highlights, zooms, and lists Category/Name for each." },
      { tag: "07 — WORKSETS", title: "Model Cleanup", body: "A checklist of cleanup actions — CAD imports, unused view templates, empty rooms, unused line patterns, empty group types, Purge Unused — run together or individually." },
      { tag: "08 — WORKSETS", title: "Bulk Create Worksets", body: "Point at a plain .txt list of workset names and the tool creates every one that doesn't already exist, reporting skips and failures." },
      { tag: "09 — GRIDS", title: "Flip Grids", body: "Flip direction or toggle bubble visibility on selected grids, or on every grid in the active view, in one run." }
    ],

    workflow: [
      { num: "01 — PICK", title: "Pick the tool", body: "Nine tools live under one \"ProjectManagement\" tab across five panels — Export, Sheets, Selection, Worksets and Grids." },
      { num: "02 — CONFIGURE", title: "Set it up once", body: "Each tool opens its own small dialog — select elements, set options, point at a CSV or TXT file if the tool needs one." },
      { num: "03 — RUN", title: "Run and review", body: "Tools that touch many elements report back what changed, what was skipped, and what failed, instead of failing silently." }
    ],

    pricing: {
      model: "Free download",
      free: true,
      inr: 0,
      aed: 0,
      note: "Free during early access. Details are collected only to follow up about updates and support — not for payment.",
      downloadUrl: "downloads/quick-sheets.zip",
      includes: [
        "Full extension, all 9 tools",
        "CSV/TXT-driven bulk sheet and workset tools",
        "Model cleanup checklist",
        "Email support"
      ]
    },

    faq: [
      { q: "Which Revit versions are supported?", a: "Revit 2021 through 2025 are supported. A few features, like native Purge Unused, need Revit 2022 or newer — on older versions the tool tells you to purge manually instead of failing." },
      { q: "Do I need pyRevit installed?", a: "Yes — RP Tools runs as a pyRevit extension, so pyRevit 4.8 or newer needs to be installed first." },
      { q: "Can a regular view be placed on more than one sheet?", a: "No — that's a Revit rule, not a limitation of this tool. Only Legend and Schedule views can repeat across multiple sheets; a plan, section, elevation or 3D view can only be placed once anywhere in the model." },
      { q: "Is Model Cleanup safe to run on a live project?", a: "Back up the model first. Most cleanup actions aren't easily undoable once the file is saved or synced, so it's built as an explicit checklist you select from rather than a single always-everything button." },
      { q: "How do I get access?", a: "It's a free download — fill in your details on the pricing section and the file downloads directly. No purchase or approval step needed." }
    ]
  }

  // ---- Add your next extension below as a new object ----
  // Copy the object above, change every field, give it a new
  // unique "slug", and it will automatically appear on the
  // homepage and get its own detail page at
  // extension.html?slug=your-slug
];
