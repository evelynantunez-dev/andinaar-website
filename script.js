// Header sólido al hacer scroll
(function () {
  const header = document.querySelector('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Hero video: evitar poster por defecto, forzar reproducción y fade-in cuando está listo
(function () {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const markLoaded = () => video.classList.add('is-loaded');
  const playVideo = () => {
    const promise = video.play();
    if (promise && promise.catch) {
      promise.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  };

  video.addEventListener('loadeddata', () => {
    markLoaded();
    playVideo();
  }, { once: true });

  video.addEventListener('canplay', () => {
    playVideo();
  }, { once: true });

  if (video.readyState >= 2) {
    markLoaded();
  }
})();

// Menú hamburguesa
(function () {
  const burger = document.querySelector('.hamburger-btn');
  const navbar = document.querySelector('.navbar');
  burger.addEventListener('click', () => {
    const open = navbar.classList.toggle('active');
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Sincroniza --header-h con la altura real del header (para scroll-margin-top)
(function () {
  const root = document.documentElement;
  const header = document.querySelector('header');
  function applyHeaderHeight() {
    const h = header ? header.offsetHeight : 96;
    root.style.setProperty('--header-h', h + 'px');
  }
  applyHeaderHeight();
  window.addEventListener('load', applyHeaderHeight, { once: true });
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(applyHeaderHeight, 120);
  });
})();

// Enlace activo con IntersectionObserver
(function () {
  const links = Array.from(document.querySelectorAll('.nav-center a'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        const on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    });
  }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
})();

// Proyectos recientes
document.querySelectorAll('.prx-item').forEach(item => {
  const images = Array.from(item.querySelectorAll('.prx-gallery img'));
  const total = images.length;

  // asegura una activa al inicio
  images.forEach((img, i) => img.classList.toggle('active', i === 0));

  function update(){
    const rect = item.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = 0;
    const end = rect.height - vh;
    if (rect.top > start || rect.bottom < vh) return;
    const progress = Math.min(1, Math.max(0, (-rect.top) / end));
    const index = Math.min(total - 1, Math.floor(progress * total));
    images.forEach((img, i) => img.classList.toggle('active', i === index));
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
});

// Animaciones reveal
(function () {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

// Modales: Aviso legal + Cookies
(function () {
  const openers = document.querySelectorAll('.js-open-modal');
  const modals = document.querySelectorAll('.modal');
  let lastFocus = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const panel = modal.querySelector('.modal__panel');
    if (panel) panel.focus({ preventScroll: true });
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  }

  openers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-modal');
      openModal(document.getElementById(id));
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target && e.target.getAttribute('data-close') === 'true') {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const opened = document.querySelector('.modal.is-open');
    if (opened) closeModal(opened);
  });
})();

// Botón to-top
(function () {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  function onScroll() { btn.classList.toggle('is-visible', window.scrollY > 700); }
  btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = Array.from(document.querySelectorAll('.alaska-gallery-item'));
  const lightbox = document.getElementById('alaska-lightbox');
  const lightboxImg = document.getElementById('alaska-lightbox-image');
  const closeBtn = document.querySelector('.alaska-lightbox__close');
  const prevBtn = document.querySelector('.alaska-lightbox__nav--prev');
  const nextBtn = document.querySelector('.alaska-lightbox__nav--next');

  if (!galleryItems.length || !lightbox || !lightboxImg) return;

  const images = galleryItems.map(item => ({
    href: item.getAttribute('href'),
    alt: item.querySelector('img')?.getAttribute('alt') || ''
  }));

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].href;
    lightboxImg.alt = images[currentIndex].alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].href;
    lightboxImg.alt = images[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].href;
    lightboxImg.alt = images[currentIndex].alt;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});


/* ==========================
   LIGHTBOX GALERIA KEVIN
========================== */
document.addEventListener("DOMContentLoaded", () => {
  const kevinGalleryItems = Array.from(document.querySelectorAll(".kevin-gallery-item"));
  const kevinLightbox = document.getElementById("kevin-lightbox");
  const kevinLightboxImg = document.getElementById("kevin-lightbox-image");
  const kevinCloseBtn = document.querySelector(".kevin-lightbox__close");
  const kevinPrevBtn = document.querySelector(".kevin-lightbox__nav--prev");
  const kevinNextBtn = document.querySelector(".kevin-lightbox__nav--next");

  if (!kevinGalleryItems.length || !kevinLightbox || !kevinLightboxImg) return;

  /* Tomamos solo las imágenes únicas para no repetir las duplicadas del carrusel */
  const kevinUniqueImagesMap = new Map();

  kevinGalleryItems.forEach((item) => {
    const href = item.getAttribute("href");
    const img = item.querySelector("img");
    const alt = img ? img.getAttribute("alt") || "" : "";

    if (!kevinUniqueImagesMap.has(href)) {
      kevinUniqueImagesMap.set(href, { href, alt });
    }
  });

  const kevinImages = Array.from(kevinUniqueImagesMap.values());
  let kevinCurrentIndex = 0;

  function openKevinLightbox(index) {
    kevinCurrentIndex = index;
    kevinLightboxImg.src = kevinImages[kevinCurrentIndex].href;
    kevinLightboxImg.alt = kevinImages[kevinCurrentIndex].alt;
    kevinLightbox.classList.add("is-open");
    kevinLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeKevinLightbox() {
    kevinLightbox.classList.remove("is-open");
    kevinLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showKevinPrev() {
    kevinCurrentIndex = (kevinCurrentIndex - 1 + kevinImages.length) % kevinImages.length;
    kevinLightboxImg.src = kevinImages[kevinCurrentIndex].href;
    kevinLightboxImg.alt = kevinImages[kevinCurrentIndex].alt;
  }

  function showKevinNext() {
    kevinCurrentIndex = (kevinCurrentIndex + 1) % kevinImages.length;
    kevinLightboxImg.src = kevinImages[kevinCurrentIndex].href;
    kevinLightboxImg.alt = kevinImages[kevinCurrentIndex].alt;
  }

  kevinGalleryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const href = item.getAttribute("href");
      const index = kevinImages.findIndex((img) => img.href === href);

      if (index !== -1) {
        openKevinLightbox(index);
      }
    });
  });

  if (kevinCloseBtn) kevinCloseBtn.addEventListener("click", closeKevinLightbox);
  if (kevinPrevBtn) kevinPrevBtn.addEventListener("click", showKevinPrev);
  if (kevinNextBtn) kevinNextBtn.addEventListener("click", showKevinNext);

  kevinLightbox.addEventListener("click", (e) => {
    if (e.target === kevinLightbox) {
      closeKevinLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!kevinLightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeKevinLightbox();
    if (e.key === "ArrowLeft") showKevinPrev();
    if (e.key === "ArrowRight") showKevinNext();
  });
});

/* ==========================
   LIGHTBOX GALERIA VERTECH
========================== */
document.addEventListener("DOMContentLoaded", () => {
  const vertechGalleryItems = Array.from(document.querySelectorAll(".vertech-gallery-item"));
  const vertechLightbox = document.getElementById("vertech-lightbox");
  const vertechLightboxImg = document.getElementById("vertech-lightbox-image");
  const vertechCloseBtn = document.querySelector(".vertech-lightbox__close");
  const vertechPrevBtn = document.querySelector(".vertech-lightbox__nav--prev");
  const vertechNextBtn = document.querySelector(".vertech-lightbox__nav--next");

  if (!vertechGalleryItems.length || !vertechLightbox || !vertechLightboxImg) return;

  const vertechUniqueImagesMap = new Map();

  vertechGalleryItems.forEach((item) => {
    const href = item.getAttribute("href");
    const img = item.querySelector("img");
    const alt = img ? img.getAttribute("alt") || "" : "";

    if (!vertechUniqueImagesMap.has(href)) {
      vertechUniqueImagesMap.set(href, { href, alt });
    }
  });

  const vertechImages = Array.from(vertechUniqueImagesMap.values());
  let vertechCurrentIndex = 0;

  function openVertechLightbox(index) {
    vertechCurrentIndex = index;
    vertechLightboxImg.src = vertechImages[vertechCurrentIndex].href;
    vertechLightboxImg.alt = vertechImages[vertechCurrentIndex].alt;
    vertechLightbox.classList.add("is-open");
    vertechLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeVertechLightbox() {
    vertechLightbox.classList.remove("is-open");
    vertechLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showVertechPrev() {
    vertechCurrentIndex = (vertechCurrentIndex - 1 + vertechImages.length) % vertechImages.length;
    vertechLightboxImg.src = vertechImages[vertechCurrentIndex].href;
    vertechLightboxImg.alt = vertechImages[vertechCurrentIndex].alt;
  }

  function showVertechNext() {
    vertechCurrentIndex = (vertechCurrentIndex + 1) % vertechImages.length;
    vertechLightboxImg.src = vertechImages[vertechCurrentIndex].href;
    vertechLightboxImg.alt = vertechImages[vertechCurrentIndex].alt;
  }

  vertechGalleryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const href = item.getAttribute("href");
      const index = vertechImages.findIndex((img) => img.href === href);

      if (index !== -1) {
        openVertechLightbox(index);
      }
    });
  });

  if (vertechCloseBtn) vertechCloseBtn.addEventListener("click", closeVertechLightbox);
  if (vertechPrevBtn) vertechPrevBtn.addEventListener("click", showVertechPrev);
  if (vertechNextBtn) vertechNextBtn.addEventListener("click", showVertechNext);

  vertechLightbox.addEventListener("click", (e) => {
    if (e.target === vertechLightbox) {
      closeVertechLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!vertechLightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeVertechLightbox();
    if (e.key === "ArrowLeft") showVertechPrev();
    if (e.key === "ArrowRight") showVertechNext();
  });
});