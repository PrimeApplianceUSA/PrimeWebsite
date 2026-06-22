const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const year = document.querySelector("#year");
const revealTargets = document.querySelectorAll("main > section, .site-footer");
const serviceTrack = document.querySelector("[data-service-track]");
const serviceScrollButtons = document.querySelectorAll("[data-service-scroll]");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const flashSection = (target) => {
  if (!target) {
    return;
  }

  target.classList.remove("section-flash");
  void target.offsetWidth;
  target.classList.add("section-flash");

  window.clearTimeout(target.flashTimerId);
  target.flashTimerId = window.setTimeout(() => {
    target.classList.remove("section-flash");
  }, 1200);
};

if (navLinks.length > 0) {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }

      const target = document.getElementById(hash.slice(1));
      if (!target) {
        return;
      }

      if (window.location.hash === hash) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        flashSection(target);
      } else {
        window.setTimeout(() => {
          flashSection(target);
        }, 160);
      }

      if (siteNav && siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-open");
        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (!hash || hash === "#") {
    return;
  }

  const target = document.getElementById(hash.slice(1));
  flashSection(target);
});

if (serviceTrack && serviceScrollButtons.length > 0) {
  const updateServiceButtons = () => {
    const maxScroll = serviceTrack.scrollWidth - serviceTrack.clientWidth - 4;
    const atStart = serviceTrack.scrollLeft <= 4;
    const atEnd = serviceTrack.scrollLeft >= maxScroll;

    serviceScrollButtons.forEach((button) => {
      const direction = button.getAttribute("data-service-scroll");
      button.disabled = direction === "prev" ? atStart : atEnd;
    });
  };

  serviceScrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.getAttribute("data-service-scroll");
      const shiftAmount = Math.max(serviceTrack.clientWidth * 0.78, 260);

      serviceTrack.scrollBy({
        left: direction === "next" ? shiftAmount : -shiftAmount,
        behavior: "smooth"
      });
    });
  });

  serviceTrack.addEventListener("scroll", updateServiceButtons, { passive: true });
  window.addEventListener("resize", updateServiceButtons);
  updateServiceButtons();
}

if (revealTargets.length > 0) {
  document.documentElement.classList.add("js");

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index * 80, 240)}ms`);
  });

  const showTarget = (target) => {
    target.classList.add("is-visible");
  };

  if (typeof IntersectionObserver === "function") {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        showTarget(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -12% 0px"
    });

    revealTargets.forEach((target) => {
      revealObserver.observe(target);
    });
  } else {
    const revealOnScroll = () => {
      const triggerPoint = window.innerHeight * 0.88;

      revealTargets.forEach((target) => {
        if (target.classList.contains("is-visible")) {
          return;
        }

        const { top } = target.getBoundingClientRect();
        if (top <= triggerPoint) {
          showTarget(target);
        }
      });
    };

    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll, { passive: true });
    window.addEventListener("resize", revealOnScroll);
  }
}
