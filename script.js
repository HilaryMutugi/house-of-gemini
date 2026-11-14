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

  // Stagger the three-step studio process as it enters the viewport.
  const motionCards = document.querySelectorAll(".motion-card");
  if (motionCards.length && "IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -30px 0px" });
    motionCards.forEach(card => cardObserver.observe(card));
  } else {
    motionCards.forEach(card => card.classList.add("is-visible"));
  }

  // Remove the black matte baked into the legacy process artwork without changing the silhouettes.
  document.querySelectorAll(".process-icon img").forEach(image => {
    const cleanMatte = () => {
      if (!image.naturalWidth || image.dataset.matteCleaned) return;
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const brightness = Math.max(pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]);
        if (brightness < 42) pixels.data[i + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
      image.src = canvas.toDataURL("image/png");
      image.dataset.matteCleaned = "true";
    };
    if (image.complete) cleanMatte();
    else image.addEventListener("load", cleanMatte, { once: true });
  });

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

  // Gallery viewer: click any portfolio or collection image to browse full-screen,
  // with previous/next arrows, keyboard arrows and swipe on touch screens.
  const galleryGroups = [];
  const portfolioImages = Array.from(document.querySelectorAll(".gallery-item img"));
  if (portfolioImages.length) galleryGroups.push({ images: portfolioImages, type: "portfolio" });
  document.querySelectorAll(".collection-gallery").forEach(gallery => {
    const images = Array.from(gallery.querySelectorAll("img"));
    if (images.length) galleryGroups.push({ images, type: "collection" });
  });

  if (galleryGroups.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.innerHTML = `
      <div class="lightbox-dialog">
        <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>
        <img class="lightbox-image" alt="">
        <button class="lightbox-nav lightbox-next" type="button" aria-label="Next image">&#8250;</button>
        <p class="lightbox-caption"></p>
        <p class="lightbox-counter" aria-live="polite"></p>
      </div>`;
    document.body.append(lightbox);
    const viewerImage = lightbox.querySelector(".lightbox-image");
    const viewerCaption = lightbox.querySelector(".lightbox-caption");
    const viewerCounter = lightbox.querySelector(".lightbox-counter");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const prevButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");

    let activeImages = [];
    let activeIndex = 0;

    const showImage = index => {
      activeIndex = (index + activeImages.length) % activeImages.length;
      const image = activeImages[activeIndex];
      viewerImage.src = image.src;
      viewerImage.alt = image.alt;
      const item = image.closest(".gallery-item");
      viewerCaption.textContent = item?.querySelector("h3")?.textContent || image.alt;
      const single = activeImages.length < 2;
      viewerCounter.textContent = single ? "" : `${activeIndex + 1} of ${activeImages.length}`;
      prevButton.hidden = nextButton.hidden = single;
    };

    const openLightbox = (group, image) => {
      // Portfolio images respect the active filter, so hidden items are skipped.
      activeImages = group.images.filter(img => img.closest(".gallery-item.hidden") === null);
      showImage(Math.max(0, activeImages.indexOf(image)));
      lightbox.classList.add("open");
      document.body.classList.add("modal-open");
      closeButton.focus();
    };
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.classList.remove("modal-open");
    };

    galleryGroups.forEach(group => {
      group.images.forEach(image => {
        const target = group.type === "portfolio" ? image.closest(".gallery-item") : image.closest("figure") || image;
        target.setAttribute("data-lightbox", "true");
        target.addEventListener("click", event => {
          event.preventDefault();
          openLightbox(group, image);
        });
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", () => showImage(activeIndex - 1));
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", event => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    });

    let touchStartX = null;
    lightbox.addEventListener("touchstart", event => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", event => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 48) showImage(activeIndex + (delta < 0 ? 1 : -1));
    }, { passive: true });
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

  // The footer contains its own WhatsApp action, so quietly remove the floating
  // duplicate while the footer is in view.
  const footer = document.querySelector(".site-footer");
  if (footer && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(entries => {
      document.body.classList.toggle("footer-visible", entries[0].isIntersecting);
    }, { threshold: 0.08 });
    footerObserver.observe(footer);
  }

  // Current year
  document.querySelectorAll("[data-year]").forEach(item => {
    item.textContent = new Date().getFullYear();
  });

  // Keep the collections jump bar pinned under the header and highlight the section in view.
  const jumpBar = document.querySelector(".collection-jump");
  if (header) {
    const setHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
  }
  if (jumpBar && "IntersectionObserver" in window) {
    const jumpLinks = Array.from(jumpBar.querySelectorAll("a[href^='#']"));
    const sections = jumpLinks
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const setActive = id => {
      jumpLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    };
    const spy = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] });
    sections.forEach(section => spy.observe(section));
    // Near the bottom of the page the last section may never reach the spy band.
    window.addEventListener("scroll", () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (nearBottom && sections.length) setActive(sections[sections.length - 1].id);
    }, { passive: true });
  }

  // Smoothly animate the FAQ accordion open and closed.
  document.querySelectorAll(".faq-grid details").forEach(item => {
    const summary = item.querySelector("summary");
    const content = item.querySelector("p");
    if (!summary || !content || typeof content.animate !== "function") return;
    summary.addEventListener("click", event => {
      event.preventDefault();
      if (item.open) {
        const closing = content.animate(
          [{ height: `${content.offsetHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 220, easing: "ease" }
        );
        closing.onfinish = () => { item.open = false; };
      } else {
        item.open = true;
        content.animate(
          [{ height: "0px", opacity: 0 }, { height: `${content.scrollHeight}px`, opacity: 1 }],
          { duration: 260, easing: "ease" }
        );
      }
    });
  });

  // Carry the chosen collection from "Commission this look" links into the contact form.
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const chosenCollection = params.get("collection");
    if (chosenCollection) {
      const serviceByCollection = {
        "Kimono": "Beach / resort wear",
        "Savannah Bloom": "Ankara / African print fashion",
        "Signature Elegance": "Event clothing",
        "Professional Uniform": "Industrial / corporate uniforms",
        "School Uniform": "School uniform system"
      };
      const serviceSelect = form.querySelector("#service");
      const wanted = serviceByCollection[chosenCollection];
      if (serviceSelect && wanted) {
        Array.from(serviceSelect.options).forEach(option => {
          if (option.textContent.trim() === wanted) serviceSelect.value = option.value || wanted;
        });
      }
      const messageField = form.querySelector("#message");
      if (messageField && !messageField.value) {
        messageField.value = `I'm interested in the ${chosenCollection} collection. `;
      }
      const formCard = form.closest(".form-card");
      if (formCard && !formCard.querySelector(".prefill-note")) {
        const note = document.createElement("p");
        note.className = "prefill-note";
        note.textContent = `Enquiring about: ${chosenCollection}`;
        formCard.insertBefore(note, form);
      }
    }
  }

});
