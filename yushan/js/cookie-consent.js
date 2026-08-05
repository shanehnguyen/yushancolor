(function () {
  const KEY = "yushan-cookie-consent"; // "accepted" | "declined"

  function loadAnalytics() {
    if (document.getElementById("vercel-analytics")) return;
    const s = document.createElement("script");
    s.id = "vercel-analytics";
    s.defer = true;
    s.src = "/_vercel/insights/script.js";
    document.head.appendChild(s);
  }

  const stored = localStorage.getItem(KEY);
  if (stored === "accepted") { loadAnalytics(); return; }
  if (stored === "declined") return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.id = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Cookie notice");
  banner.innerHTML = `
    <p>We use essential cookies to run the cart, and optional cookies for analytics. No ads, nothing sold to third parties. <a href="privacy">Privacy policy</a></p>
    <div class="cookie-banner__actions">
      <button type="button" class="btn btn-outline" id="cookie-decline">Decline</button>
      <button type="button" class="btn btn-primary" id="cookie-accept">Accept</button>
    </div>`;
  document.body.appendChild(banner);

  banner.querySelector("#cookie-accept").addEventListener("click", () => {
    localStorage.setItem(KEY, "accepted");
    loadAnalytics();
    banner.remove();
  });
  banner.querySelector("#cookie-decline").addEventListener("click", () => {
    localStorage.setItem(KEY, "declined");
    banner.remove();
  });

  // Keep the banner clear of the mobile sticky add-to-cart bar on PDPs
  // instead of overlapping it when both are visible at once.
  const stickyBar = document.getElementById("sticky-atc-bar");
  if (stickyBar) {
    const sync = () => {
      banner.style.bottom = stickyBar.dataset.visible === "true" ? `${stickyBar.offsetHeight}px` : "0";
    };
    new MutationObserver(sync).observe(stickyBar, { attributes: true, attributeFilter: ["data-visible"] });
    sync();
  }
})();
