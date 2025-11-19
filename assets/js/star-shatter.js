export function initStarShatter() {
  // Create the overlay container
  const overlay = document.createElement('div');
  overlay.id = 'star-shatter-overlay';
  document.body.appendChild(overlay);

  // Create canvas
  const canvas = document.createElement('canvas');
  overlay.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let shockwaves = [];
  let animationFrameId;
  let state = 'gathering'; // gathering, shattering, fading
  let startTime = Date.now();

  // Configuration
  const PARTICLE_COUNT = 400;
  const GATHER_DURATION = 1200; // ms
  const SHATTER_SPEED = 20;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = Math.max(width, height) * 1.2;
      this.speed = SHATTER_SPEED * 1.5;
      this.alpha = 1;
      this.lineWidth = 50;
    }

    update() {
      this.radius += this.speed;
      this.alpha -= 0.02;
      this.lineWidth *= 0.95;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 220, 255, ${this.alpha})`;
      ctx.lineWidth = this.lineWidth;
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'white';
      ctx.stroke();
      ctx.restore();
    }
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      // Start from random positions for gathering
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      // Target is center
      this.tx = width / 2;
      this.ty = height / 2;

      // Random offset from center for the "star" shape
      const angle = Math.random() * Math.PI * 2;
      // More concentrated core
      const radius = Math.pow(Math.random(), 2) * 80;
      this.tx += Math.cos(angle) * radius;
      this.ty += Math.sin(angle) * radius;

      this.vx = 0;
      this.vy = 0;
      this.size = Math.random() * 3 + 1;
      // Brighter, more star-like colors
      const hue = Math.random() * 40 + 200; // Blue/Cyan/Purple
      this.color = `hsl(${hue}, 100%, 80%)`;
      this.glowColor = `hsl(${hue}, 100%, 50%)`;
      this.alpha = 0;
    }

    update(progress) {
      if (state === 'gathering') {
        // Ease towards target
        const t = Math.min(1, progress / GATHER_DURATION);
        // Cubic ease out
        const ease = 1 - Math.pow(1 - t, 3);

        this.currentX = this.x + (this.tx - this.x) * ease;
        this.currentY = this.y + (this.ty - this.y) * ease;
        this.alpha = Math.min(1, t * 3);
      } else if (state === 'shattering') {
        // Explode outwards
        if (this.vx === 0 && this.vy === 0) {
          const angle = Math.atan2(this.currentY - height / 2, this.currentX - width / 2);
          const dist = Math.sqrt(Math.pow(this.currentX - width / 2, 2) + Math.pow(this.currentY - height / 2, 2));
          const speed = Math.random() * SHATTER_SPEED + 5 + (100 / (dist + 1)); // Closer particles move faster
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
        }
        this.currentX += this.vx;
        this.currentY += this.vy;
        this.alpha -= 0.015;
        this.size *= 0.98; // Shrink as they fly
      }
    }

    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.glowColor;
      ctx.beginPath();
      ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    const now = Date.now();
    const progress = now - startTime;

    // Clear canvas with trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Slightly longer trails
    ctx.fillRect(0, 0, width, height);

    if (state === 'gathering' && progress >= GATHER_DURATION) {
      state = 'shattering';
      // Create shockwave
      shockwaves.push(new Shockwave(width / 2, height / 2));

      // Flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.backgroundColor = 'white';
      flash.style.opacity = '1';
      flash.style.transition = 'opacity 0.3s ease-out';
      flash.style.zIndex = '10000';
      flash.style.pointerEvents = 'none';
      document.body.appendChild(flash);

      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 300);
      });
    }

    // Update and draw shockwaves
    shockwaves.forEach((wave, index) => {
      wave.update();
      wave.draw();
      if (wave.alpha <= 0) shockwaves.splice(index, 1);
    });

    let activeParticles = 0;
    particles.forEach(p => {
      p.update(progress);
      p.draw();
      if (p.alpha > 0) activeParticles++;
    });

    if (state === 'shattering' && activeParticles === 0 && shockwaves.length === 0) {
      // Animation done
      overlay.classList.add('fading-out');
      setTimeout(() => {
        overlay.remove();
        cancelAnimationFrame(animationFrameId);
      }, 1000);
      return;
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Initialize
  resize();
  initParticles();
  window.addEventListener('resize', () => {
    resize();
    initParticles(); // Reset on resize for simplicity
  });

  animate();
}
