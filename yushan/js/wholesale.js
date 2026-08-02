(function () {
  const form = document.getElementById("wholesale-form");
  const note = document.getElementById("wholesale-form-note");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    note.textContent = "Sending…";
    const data = new FormData(form);
    try {
      const result = await Web3Forms.submit({
        subject: "Yushan: Wholesale/press inquiry",
        from_name: "Yushan site (wholesale page)",
        name: data.get("name"),
        email: data.get("email"),
        shop: data.get("shop"),
        location: data.get("location"),
        message: data.get("message"),
      });
      note.textContent = result.success ? "Sent. We'll reply by email." : "Something went wrong. Try again, or email hello@yushancolour.com.";
      if (result.success) form.reset();
    } catch {
      note.textContent = "Something went wrong. Try again, or email hello@yushancolour.com.";
    }
  });
})();
