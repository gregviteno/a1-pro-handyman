/* A1 Pro Handyman — attribution + conversion events.
   Captures ad-click params on landing, persists them for the whole visit,
   writes them into every lead form, and pushes dataLayer events for
   GTM (Google Ads / GA4 / Meta via GTM). */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
  var STORE = "a1_attribution";

  /* ---- 1. Capture on first page of the session ---- */
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(STORE) || "{}"); } catch (e) { saved = {}; }

  if (!saved.landing_page) {
    var params = new URLSearchParams(window.location.search);
    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) saved[k] = v.slice(0, 200);
    });
    saved.landing_page = window.location.href.slice(0, 500);
    saved.referrer = (document.referrer || "direct").slice(0, 500);
    try { sessionStorage.setItem(STORE, JSON.stringify(saved)); } catch (e) { /* private mode: degrade */ }
  }

  /* ---- 2. Write attribution into every lead form's hidden inputs ---- */
  var loadedAt = Date.now();
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
      KEYS.concat(["landing_page", "referrer"]).forEach(function (k) {
        var input = form.querySelector('input[name="' + k + '"]');
        if (input && saved[k]) input.value = saved[k];
      });
      var pageInput = form.querySelector('input[name="source_page"]');
      if (pageInput) pageInput.value = window.location.pathname;
      /* min-time-on-page spam trap: epoch seconds at load, checked server-side */
      var ts = form.querySelector('input[name="form_ts"]');
      if (ts) ts.value = Math.floor(loadedAt / 1000);
    });
  });

  /* ---- 3. Conversion events ---- */
  /* generate_lead fires on submit, before the normal POST navigates away. */
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.hasAttribute || !form.hasAttribute("data-lead-form")) return;
    if (form.querySelector('[aria-invalid="true"]')) return; /* main.js blocked it */
    window.dataLayer.push({
      event: "generate_lead",
      form_id: form.id || "lead_form",
      page_path: window.location.pathname,
      urgency: (form.querySelector('select[name="timeline"]') || {}).value || "",
      utm_source: saved.utm_source || "",
      utm_medium: saved.utm_medium || "",
      utm_campaign: saved.utm_campaign || "",
      gclid: saved.gclid || "",
      fbclid: saved.fbclid || ""
    });
  });

  /* phone_call_click on any tel: link, including the sticky mobile bar */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    window.dataLayer.push({
      event: "phone_call_click",
      link_location: a.getAttribute("data-call-location") || "body",
      page_path: window.location.pathname,
      utm_source: saved.utm_source || "",
      gclid: saved.gclid || "",
      fbclid: saved.fbclid || ""
    });
  });
})();
