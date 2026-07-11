/* A1 Pro Handyman — UI behavior. Everything here is progressive enhancement;
   the site works with JS off (native <details> FAQs, plain-scroll carousel,
   forms POST normally). */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /* ---- Mobile nav toggle ---- */
  var navBtn = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (navBtn && menu) {
    navBtn.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.querySelector(".icon-menu").classList.toggle("hidden", open);
      navBtn.querySelector(".icon-close").classList.toggle("hidden", !open);
    });
  }

  /* ---- Header dropdowns: click/tap support (hover handled in CSS) ---- */
  var dropdowns = document.querySelectorAll(".has-dropdown");
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = dd.classList.contains("is-open");
      dropdowns.forEach(function (d) {
        d.classList.remove("is-open");
        var b = d.querySelector("button");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        dd.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", function () {
    dropdowns.forEach(function (d) {
      d.classList.remove("is-open");
      var b = d.querySelector("button");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      dropdowns.forEach(function (d) { d.classList.remove("is-open"); });
      if (menu && menu.classList.contains("is-open")) navBtn.click();
    }
  });

  /* ---- Mobile accordion submenus in the slide-down menu ---- */
  document.querySelectorAll("[data-submenu-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("data-submenu-toggle"));
      if (!panel) return;
      var open = panel.classList.toggle("hidden");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      var chev = btn.querySelector("svg");
      if (chev) chev.style.transform = open ? "" : "rotate(180deg)";
    });
  });

  /* ---- FAQ: close siblings so only one is open at a time ---- */
  document.querySelectorAll("[data-faq-group]").forEach(function (group) {
    group.querySelectorAll("details").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        group.querySelectorAll("details[open]").forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  });

  /* ---- Review carousel prev/next ---- */
  document.querySelectorAll("[data-carousel]").forEach(function (wrapper) {
    var track = wrapper.querySelector(".carousel");
    if (!track) return;
    var step = function () {
      var card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 20 : 320;
    };
    wrapper.querySelectorAll("[data-carousel-prev]").forEach(function (b) {
      b.addEventListener("click", function () {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      });
    });
    wrapper.querySelectorAll("[data-carousel-next]").forEach(function (b) {
      b.addEventListener("click", function () {
        track.scrollBy({ left: step(), behavior: "smooth" });
      });
    });
  });

  /* ---- Forms: inline validation + disabled-while-submitting ---- */
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    var showError = function (input, msg) {
      var err = input.parentElement.querySelector(".field-error");
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error mt-1 text-sm font-semibold text-orange-press";
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute("aria-invalid", "true");
    };
    var clearError = function (input) {
      var err = input.parentElement.querySelector(".field-error");
      if (err) err.remove();
      input.removeAttribute("aria-invalid");
    };

    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () { clearError(input); });
    });

    form.addEventListener("submit", function (e) {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        clearError(input);
        if (!input.value.trim()) {
          showError(input, "Required — we need this to reach you.");
          ok = false;
        } else if (input.pattern && !new RegExp("^(?:" + input.pattern + ")$").test(input.value.trim())) {
          showError(
            input,
            input.name === "phone" ? "Enter a valid phone number, e.g. (914) 555-0123." :
            input.name === "zip" ? "Enter a 5-digit zip code." :
            "Please check this field."
          );
          ok = false;
        }
      });
      if (!ok) {
        e.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.textContent = "Sending…";
      }
      /* tracking.js listens for submit too (generate_lead push) */
    });
  });
})();
