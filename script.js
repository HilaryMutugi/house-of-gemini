/* HOUSE OF GEMINI - SITE INTERACTIONS */
document.addEventListener("DOMContentLoaded", () => {
  // Slim progress line across the top of the page.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  document.querySelectorAll(".site-nav a.active").forEach(link => {
    link.setAttribute("aria-current", "page");
  });

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  // Mobile navigation
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!document.body.classList.contains("menu-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });
  }

  // Header shadow after scrolling
  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 16);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Gentle reveal animations
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.03, rootMargin: "0px 0px 80px 0px" });
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add("visible"));
  }

  // Load the large brand-book PDF only when the viewer is near the viewport.
  const brandBookFrame = document.querySelector(".brand-book-viewer iframe[data-src]");
  if (brandBookFrame && window.matchMedia("(min-width: 651px)").matches) {
    const loadBrandBook = () => {
      if (!brandBookFrame.dataset.src) return;
      brandBookFrame.addEventListener("load", () => brandBookFrame.classList.add("is-loaded"), { once: true });
      brandBookFrame.src = brandBookFrame.dataset.src;
      delete brandBookFrame.dataset.src;
    };
    if ("IntersectionObserver" in window) {
      const bookObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          loadBrandBook();
          bookObserver.disconnect();
        }
      }, { rootMargin: "500px 0px" });
      bookObserver.observe(brandBookFrame.closest(".brand-book-viewer"));
    } else {
      loadBrandBook();
    }
  }

  // Portfolio filters
  const filters = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item[data-category]");
  filters.forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    const filter = button.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle("hidden", filter !== "all" && item.dataset.category !== filter);
    });
  }));

  // Inquiry form: creates a structured WhatsApp message ready for the customer to send.
  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector(".form-status");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      "Hello House of Gemini, I'd like to start an order.",
      "",
      `Name: ${data.get("name") || "Not provided"}`,
      `Organization: ${data.get("organization") || "Not provided"}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Email: ${data.get("email") || "Not provided"}`,
      `Service: ${data.get("service") || "Not selected"}`,
      `Estimated quantity: ${data.get("quantity") || "Not provided"}`,
      `Required date: ${data.get("date") || "Not provided"}`,
      "",
      "Order details:",
      data.get("message") || "Not provided"
    ];
    const whatsappUrl = `https://wa.me/254726411745?text=${encodeURIComponent(lines.join("\n"))}`;
    if (status) status.textContent = "Opening WhatsApp with your order details...";
    window.open(whatsappUrl, "_blank", "noopener");
  });

  // Portfolio lightbox - click any gallery image to inspect it full-screen.
  const galleryLinks = document.querySelectorAll(".gallery-item img");
  if (galleryLinks.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Portfolio image viewer");
    lightbox.innerHTML = `
      <div class="lightbox-dialog">
        <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
        <img class="lightbox-image" alt="">
        <p class="lightbox-caption"></p>
      </div>`;
    document.body.append(lightbox);
    const viewerImage = lightbox.querySelector(".lightbox-image");
    const viewerCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.classList.remove("modal-open");
    };

    galleryLinks.forEach(image => {
      const item = image.closest(".gallery-item");
      item?.setAttribute("data-lightbox", "true");
      item?.addEventListener("click", event => {
        event.preventDefault();
        viewerImage.src = image.src;
        viewerImage.alt = image.alt;
        viewerCaption.textContent = item.querySelector("h3")?.textContent || image.alt;
        lightbox.classList.add("open");
        document.body.classList.add("modal-open");
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  // Give visitors reliable webmail choices instead of relying on an incorrectly
  // configured browser or operating-system mailto handler.
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (emailLinks.length) {
    const emailAddress = "info@houseofgemini.co.ke";
    const emailChooser = document.createElement("div");
    emailChooser.className = "email-chooser";
    emailChooser.setAttribute("role", "dialog");
    emailChooser.setAttribute("aria-modal", "true");
    emailChooser.setAttribute("aria-labelledby", "email-chooser-title");
    emailChooser.innerHTML = `
      <div class="email-chooser-card">
        <button class="email-chooser-close" type="button" aria-label="Close email options">&times;</button>
        <span class="eyebrow">Email House of Gemini</span>
        <h2 id="email-chooser-title">How would you like to email us?</h2>
        <p>Choose your email service or copy our address.</p>
        <div class="email-chooser-actions">
          <a class="email-option gmail" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}" target="_blank" rel="noopener">Open Gmail</a>
          <a class="email-option outlook" href="https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emailAddress)}" target="_blank" rel="noopener">Open Outlook</a>
          <a class="email-option default-mail" href="mailto:${emailAddress}">Use another email app</a>
          <button class="email-option copy-email" type="button">Copy email address</button>
        </div>
        <p class="email-copy-status" aria-live="polite"></p>
      </div>`;
    document.body.append(emailChooser);

    const closeEmailChooser = () => {
      emailChooser.classList.remove("open");
      document.body.classList.remove("modal-open");
    };
    const openEmailChooser = event => {
      event.preventDefault();
      emailChooser.classList.add("open");
      document.body.classList.add("modal-open");
      emailChooser.querySelector(".email-option").focus();
    };

    emailLinks.forEach(link => link.addEventListener("click", openEmailChooser));
    emailChooser.querySelector(".email-chooser-close").addEventListener("click", closeEmailChooser);
    emailChooser.addEventListener("click", event => {
      if (event.target === emailChooser) closeEmailChooser();
    });
    emailChooser.querySelectorAll("a.email-option").forEach(link => {
      link.addEventListener("click", () => setTimeout(closeEmailChooser, 100));
    });
    emailChooser.querySelector(".copy-email").addEventListener("click", async () => {
      const copyStatus = emailChooser.querySelector(".email-copy-status");
      try {
        await navigator.clipboard.writeText(emailAddress);
        copyStatus.textContent = "Email address copied.";
      } catch {
        copyStatus.textContent = emailAddress;
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && emailChooser.classList.contains("open")) closeEmailChooser();
    });
  }

  // Current year
  document.querySelectorAll("[data-year]").forEach(item => {
    item.textContent = new Date().getFullYear();
  });
});
