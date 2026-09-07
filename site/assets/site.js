/* Site behaviour. Two things only: the header border that appears after 24px of
 * scroll (§6.6), and the mobile nav panel. Everything else is CSS or markup. */

(function () {
  "use strict";

  // §6.6: "Bottom border 1px --color-border that appears only after 24px of scroll."
  var header = document.querySelector(".site-header");
  if (header) {
    var setScrolled = function () {
      header.setAttribute("data-scrolled", window.scrollY > 24 ? "true" : "false");
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  // Mobile nav. The button owns aria-expanded; the panel is hidden outright so
  // its links stay out of the tab order when closed (§9, keyboard).
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("nav-panel");

  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Esc closes any overlay, and focus returns to the trigger (§9).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // A resize past md leaves the panel orphaned; close it.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setOpen(false);
    });
  }
})();
