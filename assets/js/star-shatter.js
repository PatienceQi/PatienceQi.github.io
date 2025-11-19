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
  let animationFrameId;
  let state = 'gathering'; // gathering, shattering, fading
  let startTime = Date.now();

  // Configuration
  const PARTICLE_COUNT = 300;
  const GATHER_DURATION = 1500; // ms
  const SHATTER_SPEED = 15;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
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
      const radius = Math.random() * 50; // Compact star core
      this.tx += Math.cos(angle) * radius;
      this.ty += Math.sin(angle) * radius;

      this.vx = 0;
      this.vy = 0;
      this.size = Math.random() * 2 + 1;
      this.color = `hsl(${Math.random() * 60 + 200}, 100%, 80%)`; // Blue-ish
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
        this.alpha = Math.min(1, t * 2);
      } else if (state === 'shattering') {
        // Explode outwards
        if (this.vx === 0 && this.vy === 0) {
          const angle = Math.atan2(this.currentY - height / 2, this.currentX - width / 2);
          const speed = Math.random() * SHATTER_SPEED + 5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
        }
        this.currentX += this.vx;
        this.currentY += this.vy;
        this.alpha -= 0.02;
      }
    }

    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
      ctx.fill();
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    if (state === 'gathering' && progress >= GATHER_DURATION) {
      state = 'shattering';
      // Flash effect
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.backgroundColor = 'white';
      flash.style.opacity = '0.8';
      flash.style.transition = 'opacity 0.5s ease-out';
      flash.style.zIndex = '10000';
      flash.style.pointerEvents = 'none';
      document.body.appendChild(flash);
      
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
      });
    }

    let activeParticles = 0;
    particles.forEach(p => {
      p.update(progress);
      p.draw();
      if (p.alpha > 0) activeParticles++;
    });

    if (state === 'shattering' && activeParticles === 0) {
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
