(function () {
  var revealItems = Array.prototype.slice.call(
    document.querySelectorAll(".reveal"),
  );

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach(function (item, index) {
    item.style.transitionDelay = String(index * 70) + "ms";
    observer.observe(item);
  });
})();

(function () {
  var nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  var lastY = window.scrollY || 0;
  var minDelta = 8;

  function handleScroll() {
    var currentY = window.scrollY || 0;
    var delta = currentY - lastY;

    if (currentY < 90) {
      nav.classList.remove("nav-hidden");
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < minDelta) {
      return;
    }

    if (delta > 0) {
      nav.classList.add("nav-hidden");
    } else {
      nav.classList.remove("nav-hidden");
    }

    lastY = currentY;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
})();

(function () {
  var consentCookieName = "conquest_cookie_consent";
  var consentDurationSeconds = 60 * 60 * 24 * 180;

  function getCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : "";
  }

  function setCookie(name, value, maxAgeSeconds) {
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; path=/; max-age=" +
      String(maxAgeSeconds) +
      "; SameSite=Lax";
  }

  function removeBanner() {
    var current = document.getElementById("cookie-banner");
    if (current) {
      current.remove();
    }
  }

  function applyConsentState(state) {
    document.body.setAttribute("data-cookie-consent", state);
    window.CONQUEST_COOKIE_CONSENT = state;
  }

  function enableSiteCookies() {
    setCookie("conquest_session_pref", "enabled", consentDurationSeconds);
  }

  function disableSiteCookies() {
    setCookie("conquest_session_pref", "disabled", consentDurationSeconds);
  }

  function showBanner() {
    if (document.getElementById("cookie-banner")) {
      return;
    }

    var banner = document.createElement("section");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML =
      '<p class="cookie-text">We use cookies to remember preferences and improve the Conquest experience.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn cookie-btn-reject">Reject</button>' +
      '<button type="button" class="cookie-btn cookie-btn-accept">Accept Cookies</button>' +
      "</div>";

    document.body.appendChild(banner);

    var acceptButton = banner.querySelector(".cookie-btn-accept");
    var rejectButton = banner.querySelector(".cookie-btn-reject");

    if (acceptButton) {
      acceptButton.addEventListener("click", function () {
        setCookie(consentCookieName, "accepted", consentDurationSeconds);
        enableSiteCookies();
        applyConsentState("accepted");
        removeBanner();
      });
    }

    if (rejectButton) {
      rejectButton.addEventListener("click", function () {
        setCookie(consentCookieName, "rejected", consentDurationSeconds);
        disableSiteCookies();
        applyConsentState("rejected");
        removeBanner();
      });
    }
  }

  var consentState = getCookie(consentCookieName);

  if (consentState === "accepted") {
    applyConsentState("accepted");
    enableSiteCookies();
    return;
  }

  if (consentState === "rejected") {
    applyConsentState("rejected");
    disableSiteCookies();
    return;
  }

  applyConsentState("unset");
  showBanner();
})();
