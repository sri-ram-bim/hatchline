/* ============================================================
   HATCHLINE — shared extension-page renderer
   ------------------------------------------------------------
   Pure, DOM-free function that turns one extension object into
   {title, description, navCtaHtml, bodyHtml}.

   Used by TWO callers:
     1. assets/js/detail.js (in the browser, at runtime)
     2. scripts/build-pages.js (in Node, at commit time, to bake
        real <title>/<meta>/content into static HTML files for
        search engines and social previews)

   Because both callers share this one function, the rendered
   markup can never drift between the "live" client-rendered
   page and the "prebuilt" static page.

   IMPORTANT: this file must never touch `document`, `window`,
   or any other browser-only global — that's what makes it safe
   to run under plain Node with no extra dependencies.
   ============================================================ */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HatchlineRender = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderExtensionPage(ext) {
    var comparisonRows = ext.comparison
      .map(function (row) {
        return (
          "<tr>" +
          "<td>" + escapeHtml(row.capability) + "</td>" +
          '<td class="col-manual">' + escapeHtml(row.manual) + "</td>" +
          '<td class="col-bulk">' + escapeHtml(row.tool) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    var featureCallouts = ext.features
      .map(function (f) {
        return (
          '<div class="callout">' +
          '<span class="tag">' + escapeHtml(f.tag) + "</span>" +
          "<h3>" + escapeHtml(f.title) + "</h3>" +
          "<p>" + escapeHtml(f.body) + "</p>" +
          "</div>"
        );
      })
      .join("");

    var workflowCards = ext.workflow
      .map(function (w) {
        return (
          '<div class="wf-card">' +
          '<span class="wf-num">' + escapeHtml(w.num) + "</span>" +
          "<h3>" + escapeHtml(w.title) + "</h3>" +
          "<p>" + escapeHtml(w.body) + "</p>" +
          "</div>"
        );
      })
      .join("");

    var pricingIncludes = ext.pricing.includes
      .map(function (i) {
        return "<li>" + escapeHtml(i) + "</li>";
      })
      .join("");

    var changelogHtml = "";
    if (ext.changelog && ext.changelog.length) {
      changelogHtml = ext.changelog
        .map(function (entry, i) {
          var items = entry.changes
            .map(function (c) {
              return "<li>" + escapeHtml(c) + "</li>";
            })
            .join("");
          var downloadBtn = entry.downloadUrl
            ? '<button type="button" class="btn btn-ghost btn-sm changelog-download" data-version="' +
              escapeHtml(entry.version) +
              '" data-url="' +
              escapeHtml(entry.downloadUrl) +
              '">Download v' +
              escapeHtml(entry.version) +
              "</button>"
            : "";
          return (
            '<div class="changelog-entry">' +
            '<div class="changelog-version">' +
            '<span class="version-badge">v' + escapeHtml(entry.version) + "</span>" +
            (i === 0 ? '<span class="changelog-latest">Latest</span>' : "") +
            "</div>" +
            '<ul class="changelog-list">' + items + "</ul>" +
            (downloadBtn ? '<div class="changelog-download-row">' + downloadBtn + "</div>" : "") +
            "</div>"
          );
        })
        .join("");
    }

    var faqItems = ext.faq
      .map(function (item, i) {
        return (
          '<div class="faq-item' + (i === 0 ? " open" : "") + '">' +
          '<button class="faq-q" aria-expanded="' + (i === 0 ? "true" : "false") + '">' +
          escapeHtml(item.q) +
          '<span class="plus">+</span>' +
          "</button>" +
          '<div class="faq-a"><div class="faq-a-in">' + escapeHtml(item.a) + "</div></div>" +
          "</div>"
        );
      })
      .join("");

    var queueRows = [
      { num: "M-201", name: "First Floor HVAC" },
      { num: "P-101", name: "Basement Plumbing" },
      { num: "E-301", name: "Roof Electrical" },
      { num: "A-104", name: "Ground Floor Plan" },
    ]
      .map(function (r) {
        return (
          '<div class="queue-row">' +
          '<span class="qbox" data-row></span>' +
          '<span class="qname">' + r.num + " \u2014 " + r.name + "</span>" +
          '<span class="qstatus" data-status>queued</span>' +
          "</div>"
        );
      })
      .join("");

    var formatChips = ext.badges
      .map(function (b, i) {
        return '<span class="fmt-chip" data-fmt="' + i + '">' + escapeHtml(b) + "</span>";
      })
      .join("");

    var mailtoAccess =
      "mailto:" + ext.developer.email + "?subject=" + encodeURIComponent("Hatchline - " + ext.name + " - Access Request");

    var bodyHtml =
      // ---- HERO ----
      '<section class="hero">' +
      '<div class="wrap">' +
      '<a class="back-link" href="index.html">\u2190 All extensions</a>' +
      '<div class="hero-grid">' +
      "<div>" +
      '<div class="titleblock">' +
      '<span class="tagx">' + escapeHtml(ext.heroEyebrowTag) + "</span>" +
      "<span>" + escapeHtml(ext.heroEyebrowLabel) + "</span>" +
      (ext.version ? '<span class="version-badge">v' + escapeHtml(ext.version) + "</span>" : "") +
      "</div>" +
      "<h1>" + escapeHtml(ext.tagline) + "</h1>" +
      '<p class="lede">' + escapeHtml(ext.longIntro) + "</p>" +
      '<div class="hero-ctas">' +
      '<a class="btn btn-primary" href="#pricing">Download \u2193</a>' +
      '<a class="btn btn-ghost" href="#workflow">See how it works \u2193</a>' +
      "</div>" +
      "</div>" +
      '<div class="queue-panel reveal" aria-hidden="true">' +
      '<div class="queue-head"><span>' + escapeHtml(ext.name) + " \u2014 Export Queue</span><span class=\"pill\">4 sheets</span></div>" +
      '<div class="queue-formats">' + formatChips + "</div>" +
      '<div class="queue-rows">' + queueRows + "</div>" +
      '<div class="queue-progress">' +
      '<div class="bar-track"><div class="bar-fill"></div></div>' +
      '<div class="bar-caption"><span>Exporting\u2026</span><span data-count>0 of 4 complete</span></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      // ---- COMPARISON ----
      '<section class="grid-bg">' +
      '<div class="wrap">' +
      '<div class="section-head reveal">' +
      '<span class="eyebrow">Schedule \u2014 Comparison</span>' +
      "<h2>Where the time actually goes</h2>" +
      "<p>Manual export means re-opening the same dialog per format, per sheet, per revision.</p>" +
      "</div>" +
      '<div class="schedule-wrap reveal">' +
      '<table class="schedule">' +
      "<caption>" + escapeHtml(ext.name) + " \u2014 Method Comparison</caption>" +
      "<thead><tr><th>Capability</th><th>Manual export</th><th>" + escapeHtml(ext.name) + "</th></tr></thead>" +
      "<tbody>" + comparisonRows + "</tbody>" +
      "</table>" +
      "</div>" +
      '<p class="schedule-note">' + escapeHtml(ext.compatibility) + "</p>" +
      "</div>" +
      "</section>" +
      // ---- FEATURES ----
      "<section>" +
      '<div class="wrap">' +
      '<div class="section-head reveal">' +
      '<span class="eyebrow">Detail Callouts</span>' +
      "<h2>What's actually in the tool</h2>" +
      "</div>" +
      '<div class="callouts reveal">' + featureCallouts + "</div>" +
      "</div>" +
      "</section>" +
      // ---- WORKFLOW ----
      '<section id="workflow" class="grid-bg">' +
      '<div class="wrap">' +
      '<div class="section-head reveal"><span class="eyebrow">How it works</span><h2>Three tabs, one export</h2></div>' +
      '<div class="workflow reveal">' + workflowCards + "</div>" +
      "</div>" +
      "</section>" +
      // ---- CHANGELOG ----
      (changelogHtml
        ? '<section id="changelog">' +
          '<div class="wrap">' +
          '<div class="section-head reveal">' +
          '<span class="eyebrow">Version History</span>' +
          "<h2>What's changed</h2>" +
          "</div>" +
          '<div class="changelog-wrap reveal">' + changelogHtml + "</div>" +
          "</div>" +
          "</section>"
        : "") +
      // ---- DOWNLOAD ----
      '<section id="pricing">' +
      '<div class="wrap">' +
      '<div class="section-head reveal">' +
      '<span class="eyebrow">Get it</span>' +
      "<h2>Download</h2>" +
      "</div>" +
      '<div class="pricing reveal">' +
      '<div class="price-card">' +
      '<span class="price-tag">' + escapeHtml(ext.name) + "</span>" +
      (ext.pricing.free
        ? '<div class="price-amount"><span class="big">Free</span></div>'
        : '<div class="price-amount"><span class="big">\u20B9' +
          ext.pricing.inr +
          '</span><span class="alt">\u2248 AED ' +
          ext.pricing.aed.toFixed(2) +
          "</span></div>") +
      '<span class="price-model">' + escapeHtml(ext.pricing.model) + "</span>" +
      '<ul class="price-list">' + pricingIncludes + "</ul>" +
      '<button type="button" class="btn btn-primary" id="hlDownloadBtn" style="width:100%;justify-content:center;">Download now</button>' +
      '<p class="price-note">' + escapeHtml(ext.pricing.note) + "</p>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      // ---- CREDIBILITY + FAQ ----
      '<section class="grid-bg">' +
      '<div class="wrap cred">' +
      '<div class="reveal">' +
      '<span class="eyebrow">Who built this</span>' +
      '<p class="cred-quote">\u201C' + escapeHtml(ext.developer.quote) + '\u201D</p>' +
      '<p class="cred-byline">' +
      escapeHtml(ext.developer.name.toUpperCase()) +
      " \u2014 " +
      escapeHtml(ext.developer.role) +
      "<br>" +
      escapeHtml(ext.developer.email) +
      "</p>" +
      "</div>" +
      '<div class="reveal">' +
      '<span class="eyebrow">Frequently asked</span>' +
      '<div id="faqList">' + faqItems + "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      // ---- CTA STRIP ----
      "<section>" +
      '<div class="wrap">' +
      '<div class="cta-strip reveal">' +
      "<div><h2>" + escapeHtml(ext.tagline) + "</h2><p>Questions before you get started? Reach out and get a straight answer.</p></div>" +
      '<a class="btn btn-primary" href="contact.html">Contact</a>' +
      "</div>" +
      "</div>" +
      "</section>";

    return {
      title: ext.name + " \u2014 Hatchline",
      description: ext.shortDescription,
      navCtaHtml: '<a class="btn btn-primary btn-sm" href="#pricing">Download</a>',
      bodyHtml: bodyHtml,
      mailtoAccess: mailtoAccess,
    };
  }

  return { renderExtensionPage: renderExtensionPage, escapeHtml: escapeHtml };
});
