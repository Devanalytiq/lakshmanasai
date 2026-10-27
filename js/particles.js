/* ============================================================
   PARTICLE BACKGROUND — full-page canvas 2D particle field
   ============================================================ */

(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse = { x: null, y: null };
  const COLORS = ['#00f0ff', '#a855ff', '#ff2fb0'];
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 45 : 110;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = rand(0, width);
      this.y = rand(0, height);
      this.r = rand(0.6, 2.2);
      this.vx = rand(-0.15, 0.15);
      this.vy = rand(-0.15, 0.15);
      this.color = COLORS[Math.floor(rand(0, COLORS.length))];
      this.alpha = rand(0.25, 0.85);
      this.twinkleSpeed = rand(0.005, 0.02);
      this.twinklePhase = rand(0, Math.PI * 2);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.twinklePhase += this.twinkleSpeed;

      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 1.4;
          this.y += (dy / dist) * force * 1.4;
        }
      }
    }
    draw() {
      const a = this.alpha * (0.6 + 0.4 * Math.sin(this.twinklePhase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = a;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function connect() {
    const maxDist = isMobile ? 90 : 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 240, 255, ' + (0.12 * (1 - dist / maxDist)) + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('load', () => {
    resize();
  });

  init();
  animate();
})();
