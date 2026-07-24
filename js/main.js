/* A1 Pro Handyman — UI behavior. Everything here is progressive enhancement;
   the site works with JS off (native <details> FAQs, plain-scroll carousel,
   forms POST normally). */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /* ---- Sticky header: shrink logo once the page is scrolled ---- */
  var stickyHeader = document.querySelector("header.sticky");
  if (stickyHeader) {
    var headerTicking = false;
    var applyHeaderScrollState = function () {
      headerTicking = false;
      var y = window.scrollY;
      // Hysteresis: enter/exit at different thresholds so scroll jitter near
      // the boundary can't rapidly re-toggle the class and re-trigger the resize.
      if (y > 80) {
        stickyHeader.classList.add("is-scrolled");
      } else if (y < 40) {
        stickyHeader.classList.remove("is-scrolled");
      }
    };
    var onHeaderScroll = function () {
      if (!headerTicking) {
        headerTicking = true;
        window.requestAnimationFrame(applyHeaderScrollState);
      }
    };
    stickyHeader.classList.toggle("is-scrolled", window.scrollY > 80);
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

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

  /* ---- Hero quote funnel: one question per step so the form card doesn't block the hero photo ---- */
  document.querySelectorAll("form[data-funnel-form]").forEach(function (form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll("[data-funnel-step]"));
    var progress = form.querySelector("[data-funnel-progress]");
    if (!steps.length) return;
    var total = steps.length;

    var showStepError = function (input, msg) {
      var err = input.parentElement.querySelector(".field-error");
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error mt-1 text-sm font-semibold text-orange-press";
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute("aria-invalid", "true");
    };

    var goToStep = function (index) {
      steps.forEach(function (step, i) {
        step.style.display = i === index ? "grid" : "none";
      });
      if (progress) progress.textContent = "Step " + (index + 1) + " of " + total;
      var firstField = steps[index].querySelector("input, textarea, select");
      if (firstField) firstField.focus();
    };

    var validateStep = function (step) {
      var ok = true;
      step.querySelectorAll("[required]").forEach(function (input) {
        input.removeAttribute("aria-invalid");
        var err = input.parentElement.querySelector(".field-error");
        if (err) err.remove();
        if (!input.value.trim()) {
          showStepError(input, "Required — we need this to reach you.");
          ok = false;
        } else if (input.pattern && !new RegExp("^(?:" + input.pattern + ")$").test(input.value.trim())) {
          showStepError(
            input,
            input.name === "zip" ? "Enter a 5-digit zip code." :
            input.name === "phone" ? "Enter a valid phone number, e.g. (914) 555-0123." :
            "Please check this field."
          );
          ok = false;
        } else if (input.type === "email" && !input.checkValidity()) {
          showStepError(input, "Enter a valid email, e.g. name@example.com.");
          ok = false;
        }
      });
      return ok;
    };

    steps.forEach(function (step, i) {
      step.querySelectorAll("[data-funnel-next]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!validateStep(step)) return;
          if (i < total - 1) goToStep(i + 1);
        });
      });
      step.querySelectorAll("[data-funnel-back]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (i > 0) goToStep(i - 1);
        });
      });
    });

    /* Enter key in a single-line field advances to the next step (or submits on the last) */
    form.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.target.tagName === "TEXTAREA") return;
      var step = e.target.closest("[data-funnel-step]");
      if (!step) return;
      e.preventDefault();
      var nextBtn = step.querySelector("[data-funnel-next]");
      if (nextBtn) { nextBtn.click(); return; }
      var submitBtn = step.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
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
        } else if (input.type === "email" && !input.checkValidity()) {
          showError(input, "Enter a valid email, e.g. name@example.com.");
          ok = false;
        }
      });
      if (!ok) {
        e.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }
      /* Submit via fetch (works on Formspree's free plan) so we control the
         redirect ourselves — Formspree's own "Redirect" setting is a paid feature. */
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.textContent = "Sending…";
      }
      /* tracking.js listens for submit too (generate_lead push) */
      var formError = form.querySelector(".form-error");
      if (formError) formError.remove();
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (response.ok) {
          var next = form.querySelector('input[name="_next"]');
          window.location.href = (next && next.value) || "/thank-you.html";
        } else {
          throw new Error("submit-failed");
        }
      }).catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.label;
        }
        var err = document.createElement("p");
        err.className = "form-error mt-3 text-sm font-semibold text-orange-press";
        err.textContent = "Something went wrong sending that. Please call us at (914) 693-0009 and we'll get you booked.";
        form.appendChild(err);
      });
    });
  });
})();
