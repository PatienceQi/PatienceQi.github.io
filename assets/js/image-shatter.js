export function initImageShatter() {
    const container = document.createElement('div');
    container.id = 'shatter-container';
    document.documentElement.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.id = 'shatter-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let image;
    let shards = [];
    let isExploding = false;
    let animationId;

    // Configuration
    const SHARD_COUNT = 150; // Number of pieces
    const EXPLOSION_SPEED = 15;
    const ROTATION_SPEED = 0.1;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Load Image
    const img = new Image();
    img.src = '/picture/picture1.png';
    img.onload = () => {
        image = img;
        resize();
        createShards();
        // Auto-start after a brief delay to ensure render
        setTimeout(() => {
            isExploding = true;
        }, 500);
        draw();
    };
    img.onerror = (e) => {
        console.error('Failed to load image', e);
    };

    class Shard {
        constructor(x, y, w, h, u, v, uw, vh) {
            this.x = x; // Center x
            this.y = y; // Center y
            this.w = w;
            this.h = h;

            // Texture coordinates
            this.u = u;
            this.v = v;
            this.uw = uw;
            this.vh = vh;

            // Physics
            this.vx = (Math.random() - 0.5) * EXPLOSION_SPEED;
            this.vy = (Math.random() - 0.5) * EXPLOSION_SPEED;
            this.angle = 0;
            this.va = (Math.random() - 0.5) * ROTATION_SPEED;

            // 3D Rotation simulation for glass effect
            this.rotX = Math.random() * Math.PI;
            this.rotY = Math.random() * Math.PI;
            this.vRotX = (Math.random() - 0.5) * 0.1;
            this.vRotY = (Math.random() - 0.5) * 0.1;

            // State
            this.startX = x;
            this.startY = y;
            this.currentX = x;
            this.currentY = y;
            this.alpha = 1;
        }

        update(isActive) {
            if (isActive) {
                this.currentX += this.vx;
                this.currentY += this.vy;
                this.angle += this.va;
                this.rotX += this.vRotX;
                this.rotY += this.vRotY;

                // Gravity/Drift
                this.vy += 0.1;

                // Fade out when far
                const dist = Math.sqrt(Math.pow(this.currentX - width / 2, 2) + Math.pow(this.currentY - height / 2, 2));
                if (dist > Math.max(width, height)) {
                    this.alpha -= 0.02;
                }
            }
        }

        draw() {
            if (this.alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = this.alpha;

            // Move to position and rotate
            ctx.translate(this.currentX, this.currentY);
            ctx.rotate(this.angle);

            ctx.beginPath();
            ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
            ctx.clip();

            ctx.drawImage(image, this.u, this.v, this.uw, this.vh, -this.w / 2, -this.h / 2, this.w, this.h);

            // Glass Reflection Effect
            const lightX = -0.5;
            const lightY = -0.5;
            const lightZ = 0.7;

            const nx = Math.sin(this.rotY) * Math.cos(this.rotX);
            const ny = -Math.sin(this.rotX);
            const nz = Math.cos(this.rotY) * Math.cos(this.rotX);

            const intensity = Math.max(0, nx * lightX + ny * lightY + nz * lightZ);

            if (intensity > 0) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.6})`;
                ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);

                if (intensity > 0.8) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
                    ctx.beginPath();
                    ctx.moveTo(-this.w / 2, -this.h / 2);
                    ctx.lineTo(this.w / 2, 0);
                    ctx.lineTo(-this.w / 2, this.h / 2);
                    ctx.fill();
                }
            }

            ctx.restore();
        }
    }

    function createShards() {
        shards = [];
        const cols = 10;
        const rows = 10;
        const cellW = width / cols;
        const cellH = height / rows;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * cellW + cellW / 2;
                const y = j * cellH + cellH / 2;
                const w = cellW * (0.8 + Math.random() * 0.4);
                const h = cellH * (0.8 + Math.random() * 0.4);

                const u = i * (image.width / cols);
                const v = j * (image.height / rows);
                const uw = image.width / cols;
                const vh = image.height / rows;

                shards.push(new Shard(x, y, w, h, u, v, uw, vh));
            }
        }
    }

    function draw() {
        // Initial draw before animation
        ctx.clearRect(0, 0, width, height);
        shards.forEach(shard => shard.draw());
        if (!isExploding) {
            requestAnimationFrame(draw);
        } else {
            animate();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        let allGone = true;
        shards.forEach(shard => {
            shard.update(isExploding);
            shard.draw();
            if (shard.alpha > 0) allGone = false;
        });

        if (allGone) {
            // Animation complete
            container.style.transition = 'opacity 1s ease';
            container.style.opacity = '0';
            setTimeout(() => {
                container.remove();
                cancelAnimationFrame(animationId);
            }, 1000);
            return;
        }

        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        if (image) createShards();
    });
}
