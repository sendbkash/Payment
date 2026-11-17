// XE66.COM Clone — shared script
document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("mobile-open"));
  }

  // Payment method selection (deposit/withdrawal)
  document.querySelectorAll(".method").forEach((m) => {
    m.addEventListener("click", () => {
      document.querySelectorAll(".method").forEach((x) => x.classList.remove("selected"));
      m.classList.add("selected");
    });
  });

  // Toast helper
  window.showToast = (msg, ok = false) => {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.toggle("ok", ok);
    t.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
  };

  // Simple form handlers (demo)
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) { btn.textContent = "প্রক্রিয়া হচ্ছে..."; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.textContent = original; btn.disabled = false; }
        window.showToast(form.dataset.msg || "অপরেশন সফল হয়েছে!", true);
      }, 1200);
    });
  });
});
