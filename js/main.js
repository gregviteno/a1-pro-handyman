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

  /* ---- Photo attachments ----
     Formspree's free plan rejects any submission carrying a file, and since we
     POST the whole form in one shot that was failing the ENTIRE lead — the
     customer got "Something went wrong" and we lost their name and phone along
     with the photo. So the photo is stripped out of the Formspree POST and sent
     on its own to /photo-handler.php, which emails it as an attachment. The
     lead is never held hostage to the upload: if the photo send fails we still
     redirect to the thank-you page. */

  var MAX_PHOTO_BYTES = 10485760; /* 10 MB — keep in sync with photo-handler.php */
  var MAX_PHOTO_EDGE = 1600;      /* longest edge after downscaling */
  var PHOTO_TIMEOUT = 30000;
  var PHOTO_TYPES = /^(image\/(jpeg|png|webp|gif|heic|heif)|application\/pdf)$/i;

  var photoOf = function (form) {
    var input = form.querySelector('input[type="file"]');
    if (!input || !input.files || !input.files.length) return null;
    return { input: input, file: input.files[0] };
  };

  /* Phone cameras produce 3-8 MB files; re-encoding to a sane size makes the
     upload finish on cell data and keeps the emailed attachment small. Any
     failure (PDF, HEIC on Android, no canvas) just falls back to the original. */
  var shrinkImage = function (file) {
    return new Promise(function (resolve) {
      var canDecode = /^image\/(jpeg|png|webp)$/i.test(file.type);
      if (!canDecode || file.size < 400000 || !window.createImageBitmap) {
        resolve(file);
        return;
      }
      window.createImageBitmap(file, { imageOrientation: "from-image" }).then(function (bmp) {
        var scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(bmp.width, bmp.height));
        var canvas = document.createElement("canvas");
        if (scale === 1 || !canvas.toBlob) {
          if (bmp.close) bmp.close();
          resolve(file);
          return;
        }
        canvas.width = Math.round(bmp.width * scale);
        canvas.height = Math.round(bmp.height * scale);
        canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
        if (bmp.close) bmp.close();
        canvas.toBlob(function (blob) {
          resolve(blob && blob.size < file.size ? blob : file);
        }, "image/jpeg", 0.82);
      }).catch(function () { resolve(file); });
    });
  };

  var sendPhoto = function (form, file, btn) {
    if (btn) btn.textContent = "Uploading photo…";
    return shrinkImage(file).then(function (blob) {
      var data = new FormData();
      var name = (file.name || "photo").replace(/[^\w.\- ]+/g, "_");
      /* A shrunk blob is re-encoded JPEG, so its old extension would lie. */
      data.append("photo", blob, blob === file ? name : name.replace(/\.[^.]*$/, "") + ".jpg");
      ["name", "phone", "email", "zip", "form_ts", "gclid", "source_page", "_gotcha"].forEach(function (field) {
        var el = form.querySelector('[name="' + field + '"]');
        if (el) data.append(field, el.value);
      });
      data.append("form_id", form.id || "lead_form");

      var controller = window.AbortController ? new AbortController() : null;
      var timer = window.setTimeout(function () { if (controller) controller.abort(); }, PHOTO_TIMEOUT);
      return fetch("/photo-handler.php", {
        method: "POST",
        body: data,
        signal: controller ? controller.signal : undefined
      }).then(function (r) { window.clearTimeout(timer); return r; });
    }).catch(function () {
      /* Swallowed on purpose — the lead is already saved and the redirect
         must happen regardless of what went wrong with the photo. */
    });
  };

  /* Restart-safe: the class has to come off before it can re-trigger, so a
     second failed submit shakes again instead of sitting still. */
  var shake = function (el) {
    if (!el) return;
    el.classList.remove("is-shaking");
    void el.offsetWidth; /* force reflow so the animation restarts */
    el.classList.add("is-shaking");
    var done = function () {
      el.classList.remove("is-shaking");
      el.removeEventListener("animationend", done);
    };
    el.addEventListener("animationend", done);
  };

  /* ---- Attention wiggle: nudge each quote card whenever it scrolls into view,
     so the form keeps catching the eye on the way back up or down the page.
     Re-arms only after the card has properly left the viewport (two thresholds
     give it hysteresis) so hovering near the edge can't machine-gun it. */
  (function () {
    var cards = document.querySelectorAll("form.work-order");
    if (!cards.length) return;

    var nudge = function (card) {
      /* Remove + reflow so a repeat nudge restarts the animation. */
      card.classList.remove("is-attention");
      void card.offsetWidth;
      card.classList.add("is-attention");
      card.addEventListener("animationend", function done() {
        card.classList.remove("is-attention");
        card.removeEventListener("animationend", done);
      });
    };

    if (!window.IntersectionObserver) {
      window.setTimeout(function () { nudge(cards[0]); }, 900);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var card = entry.target;
        if (entry.intersectionRatio >= 0.35) {
          if (card.dataset.nudged === "1") return;
          card.dataset.nudged = "1";
          /* Small delay so the wiggle lands after the card has settled on
             screen, rather than competing with the scroll itself. */
          window.setTimeout(function () { nudge(card); }, 400);
        } else if (entry.intersectionRatio <= 0.1) {
          card.dataset.nudged = "";
        }
      });
    }, { threshold: [0.1, 0.35] });

    cards.forEach(function (card) { io.observe(card); });
  })();

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
      /* The photo is optional, so it isn't covered by the [required] loop above. */
      var photo = photoOf(form);
      if (photo) {
        clearError(photo.input);
        if (photo.file.size > MAX_PHOTO_BYTES) {
          showError(photo.input, "That photo is over 10 MB — please pick a smaller one, or send it later by text.");
          ok = false;
        } else if (photo.file.type && !PHOTO_TYPES.test(photo.file.type)) {
          showError(photo.input, "Please attach a photo (JPG, PNG, HEIC) or a PDF.");
          ok = false;
        }
      }

      if (!ok) {
        e.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        /* Shake the field itself when it's on screen; if the bad field is on a
           collapsed funnel step there's nothing to see, so shake the card. */
        if (firstBad && firstBad.offsetParent !== null) {
          shake(firstBad);
          firstBad.focus();
        } else {
          shake(form);
        }
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

      var lead = new FormData(form);
      /* Any file at all makes Formspree's free plan reject the whole request. */
      if (photo) {
        lead.delete(photo.input.name);
        lead.append("photo", "Customer attached a photo — it follows in a separate email.");
      }

      fetch(form.action, {
        method: "POST",
        body: lead,
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (!response.ok) throw new Error("submit-failed");
        return photo ? sendPhoto(form, photo.file, btn) : null;
      }).then(function () {
        var next = form.querySelector('input[name="_next"]');
        window.location.href = (next && next.value) || "/thank-you.html";
      }).catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.label;
        }
        var err = document.createElement("p");
        err.className = "form-error mt-3 text-sm font-semibold text-orange-press";
        err.textContent = "Something went wrong sending that. Please call us at (914) 693-0009 and we'll get you booked.";
        form.appendChild(err);
        shake(form);
      });
    });
  });
})();
