/* =============================================
   HOUSE 136 CLUB — MAIN JS
   ============================================= */

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- FLOATING PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// Stagger children within grid sections
function staggerChildren(parentSelector, childSelector, baseDelay = 80) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      child.style.transitionDelay = `${i * baseDelay}ms`;
    });
  });
}
staggerChildren('.impact-grid', '.impact-card', 90);
staggerChildren('.bot-grid', '.bot-card', 90);
staggerChildren('.about-visual', '.about-card', 80);
staggerChildren('.activities-grid', '.activity-card', 90);

// ---- AUTO-CALCULATE YEARS OF SERVICE (founded October 2013) ----
function calculateYearsOfService() {
  const founded = new Date(2013, 9, 1); // October is month index 9
  const now = new Date();
  let years = now.getFullYear() - founded.getFullYear();
  // If we haven't reached October yet this year, don't count the current year
  const hasReachedAnniversary =
    now.getMonth() > founded.getMonth() ||
    (now.getMonth() === founded.getMonth() && now.getDate() >= founded.getDate());
  if (!hasReachedAnniversary) years -= 1;
  return years;
}
const yearsEl = document.getElementById('yearsOfService');
if (yearsEl) {
  yearsEl.setAttribute('data-count', calculateYearsOfService());
}

// ---- ANIMATED COUNTERS ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ---- SMOOTH ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? '#C8960C' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#2a7a2a';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ---- IMAGE SLIDERS (multi-photo impact cards) ----
document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.slider-arrow.prev');
  const nextBtn = slider.querySelector('.slider-arrow.next');
  const dotsWrap = slider.querySelector('.slider-dots');
  let current = 0;

  if (slides.length <= 1) {
    // Only one image: hide controls, nothing to slide
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
});


// When real images are added, clicking them can open a lightbox
// Placeholder cards get a subtle "coming soon" pulse on hover
document.querySelectorAll('.impact-img-placeholder').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.background = 'linear-gradient(135deg, #222 0%, #2e2e2e 100%)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.background = '';
  });
});

// =============================================
// DONATE MODAL
// =============================================
const donateBtn = document.getElementById('donateBtn');
const donateBtnMid = document.getElementById('donateBtnMid');
const donateModal = document.getElementById('donateModal');
const donateModalClose = document.getElementById('donateModalClose');
const copyAcctBtn = document.getElementById('copyAcctBtn');
const acctNumber = document.getElementById('acctNumber');

function openDonateModal() {
  donateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDonateModal() {
  donateModal.classList.remove('open');
  document.body.style.overflow = '';
}
if (donateBtn) donateBtn.addEventListener('click', openDonateModal);
if (donateBtnMid) donateBtnMid.addEventListener('click', openDonateModal);
if (donateModalClose) donateModalClose.addEventListener('click', closeDonateModal);
if (donateModal) {
  donateModal.addEventListener('click', (e) => {
    if (e.target === donateModal) closeDonateModal();
  });
}
if (copyAcctBtn) {
  copyAcctBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(acctNumber.textContent.trim()).then(() => {
      copyAcctBtn.textContent = 'Copied!';
      copyAcctBtn.classList.add('copied');
      setTimeout(() => {
        copyAcctBtn.textContent = 'Copy';
        copyAcctBtn.classList.remove('copied');
      }, 2000);
    });
  });
}

// =============================================
// WHATSAPP NUMBER CONFIG
// Replace WHATSAPP_NUMBER with the real number once you have it.
// Format: country code + number, no +, no spaces. e.g. "2348012345678"
// =============================================
const WHATSAPP_NUMBER = ''; // <-- put the number here when available, e.g. '2348012345678'

const whatsappLink = document.getElementById('whatsappLink');
if (whatsappLink) {
  if (WHATSAPP_NUMBER) {
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    whatsappLink.textContent = `+${WHATSAPP_NUMBER}`;
    whatsappLink.target = '_blank';
  } else {
    whatsappLink.addEventListener('click', (e) => e.preventDefault());
  }
}

// Override the contact form to send via WhatsApp instead of a dead submit
const sendMessageBtn = document.getElementById('sendMessageBtn');
if (form && sendMessageBtn) {
  // Remove the old "Message Sent" handler behavior by re-binding submit
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = newForm.querySelector('#name').value;
    const email = newForm.querySelector('#email').value;
    const reason = newForm.querySelector('#reason').value;
    const message = newForm.querySelector('#message').value;

    const text = `Hello House 136,%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AReason: ${encodeURIComponent(reason || 'General')}%0A%0AMessage: ${encodeURIComponent(message)}`;

    if (WHATSAPP_NUMBER) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    } else {
      const note = document.getElementById('formNote');
      if (note) {
        note.textContent = 'WhatsApp number not added yet — check back soon!';
        note.style.color = '#D4700A';
      }
    }
  });
}

// =============================================
// IMAGE LIGHTBOX
// =============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGallery = [];
let currentIndex = 0;

function openLightbox(images, index) {
  currentGallery = images;
  currentIndex = index;
  lightboxImg.src = currentGallery[currentIndex].src;
  lightboxImg.alt = currentGallery[currentIndex].alt;
  lightboxImg.classList.remove('zoomed');
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateLightboxArrows();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showLightboxImage(index) {
  currentIndex = (index + currentGallery.length) % currentGallery.length;
  lightboxImg.src = currentGallery[currentIndex].src;
  lightboxImg.alt = currentGallery[currentIndex].alt;
  lightboxImg.classList.remove('zoomed');
}
function updateLightboxArrows() {
  const multi = currentGallery.length > 1;
  lightboxPrev.style.display = multi ? 'flex' : 'none';
  lightboxNext.style.display = multi ? 'flex' : 'none';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentIndex - 1));
if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentIndex + 1));
if (lightboxImg) {
  lightboxImg.addEventListener('click', () => {
    lightboxImg.classList.toggle('zoomed');
  });
}
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
  if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
});

// Wire up every impact-card image (single image or slider) to open the lightbox
document.querySelectorAll('.impact-img-wrap').forEach(wrap => {
  const imgs = Array.from(wrap.querySelectorAll('img'));
  if (imgs.length === 0) return;

  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      // Find currently active slide if this is a slider
      let openIndex = i;
      if (wrap.classList.contains('impact-slider')) {
        const activeIdx = imgs.findIndex(im => im.classList.contains('active'));
        openIndex = activeIdx >= 0 ? activeIdx : 0;
      }
      openLightbox(imgs, openIndex);
    });
  });
});

// Wire up BOT member photos too (single image, no gallery)
document.querySelectorAll('.bot-img-wrap img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox([img], 0));
});
