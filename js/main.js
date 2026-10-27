/* ============================================================
   MAIN.JS — loader, cursor, navigation, forms, sliders, utilities
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= LOADER ================= */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      loaderBar.style.width = progress + '%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        setTimeout(() => loader.remove(), 800);
      }, 300);
      return;
    }
    loaderBar.style.width = progress + '%';
  }, 180);

  /* ================= CUSTOM CURSOR ================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch && cursorDot && cursorRing) {
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%,-50%)`;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = 'a, button, .magnetic, [data-tilt], input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add('cursor-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove('cursor-active');
    });
  }

  /* ================= MAGNETIC BUTTONS ================= */
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  /* ================= HEADER SCROLL STATE ================= */
  const header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ================= MOBILE NAV TOGGLE ================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* ================= ACTIVE NAV LINK ON SCROLL ================= */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ================= BACK TO TOP ================= */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================= TESTIMONIAL SLIDER ================= */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const slides = track.children;
    let current = 0;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.children;

    function goTo(index) {
      current = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === index));
    }

    let autoSlide = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);

    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo((current + 1) % slides.length), 5500);
    });
  }

  /* ================= CONTACT FORM VALIDATION ================= */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(input) {
    const group = input.closest('.form-group');
    let valid = true;

    if (input.hasAttribute('required') && !input.value.trim()) valid = false;
    if (input.type === 'email' && input.value.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value.trim())) valid = false;
    }
    if (input.id === 'cf-message' && input.value.trim().length < 10) valid = false;

    group.classList.toggle('error', !valid);
    return valid;
  }

  if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      inputs.forEach((input) => {
        if (!validateField(input)) allValid = false;
      });

      if (allValid) {
        formSuccess.classList.add('show');
        form.reset();
        inputs.forEach((i) => i.closest('.form-group').classList.remove('error'));
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        formSuccess.classList.remove('show');
      }
    });
  }

  /* ================= YEAR ================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================= SMOOTH ANCHOR SCROLL OFFSET ================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
