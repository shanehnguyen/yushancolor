(function () {
  const SEEN_KEY = "yushan-email-popup-seen";
  if (sessionStorage.getItem(SEEN_KEY)) return;

  const overlay = document.createElement("div");
  overlay.className = "email-popup-overlay";
  overlay.id = "email-popup-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="email-popup" role="dialog" aria-modal="true" aria-labelledby="email-popup-title">
      <button type="button" class="email-popup__close" aria-label="Close">&times;</button>
      <h2 id="email-popup-title">Get the printable pigment index</h2>
      <p>Every Colour Index code, Blue Wool rating and swatch in the range, one print-ready PDF. Join the list for early access to new colours too.</p>
      <form id="email-popup-form">
        <label class="visually-hidden" for="email-popup-input">Email address</label>
        <input type="email" id="email-popup-input" placeholder="you@example.com" required>
        <button type="submit" class="btn btn-primary">Send it to me</button>
      </form>
      <p class="email-popup__note" id="email-popup-note">No spam. Unsubscribe any time.</p>
    </div>`;
  document.body.appendChild(overlay);

  function show() {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    overlay.hidden = false;
    sessionStorage.setItem(SEEN_KEY, "true");
  }
  function hide() {
    overlay.hidden = true;
  }

  overlay.querySelector(".email-popup__close").addEventListener("click", hide);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) hide(); });

  overlay.querySelector("#email-popup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    overlay.querySelector("#email-popup-note").textContent = "You're on the list. Check your inbox to confirm.";
    e.target.reset();
    setTimeout(hide, 1800);
  });

  // Exit intent: mouse leaves through the top of the viewport (desktop).
  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && e.clientY <= 0) show();
  });

  // Fallback for touch devices / anyone who never mouses to the top: timed trigger.
  setTimeout(show, 25000);
})();
