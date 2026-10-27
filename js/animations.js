/* ============================================================
   GSAP ANIMATIONS — scroll reveals, counters, timeline, tilt
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Split hero title words for cinematic reveal ---------- */
  // Words already wrapped in .reveal-word spans in markup

  /* ---------- IntersectionObserver-based reveal (lightweight, no GSAP dependency required) ---------- */
  const revealEls = document.querySelectorAll('.reveal-line, .reveal-word, .reveal-up');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-line, .reveal-word, .reveal-up'));
        const idx = siblings.indexOf(el);
        el.style.animationDelay = (idx % 6) * 0.08 + 's';
        el.classList.add('in-view');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach((el) => io.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1600;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.floor(eased * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterIO.observe(el));

  /* ---------- Skill bar fills ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.width + '%';
        skillIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach((el) => skillIO.observe(el));

  /* ---------- Timeline progress line ---------- */
  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  if (timeline && timelineProgress) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let visible = vh * 0.75 - rect.top;
      visible = Math.max(0, Math.min(visible, total));
      const pct = (visible / total) * 100;
      timelineProgress.style.height = pct + '%';
    }, { passive: true });
  }

  /* ---------- 3D Card Tilt ---------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    let bounds;
    const strength = 10;

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width / 2;
      const cy = bounds.height / 2;
      const rotateX = ((y - cy) / cy) * -strength;
      const rotateY = ((x - cx) / cx) * strength;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ---------- Typewriter effect ---------- */
  const roles = [
    'AI & Data Science Engineer',
    'Python & SQL Developer',
    'ETL Pipeline Architect',
    'Machine Learning Practitioner',
    'Azure & AWS Cloud Enthusiast',
  ];
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    }
    type();
  }

});
