export function initImageShatter() {
    const container = document.createElement('div');
    container.id = 'shatter-container';
    document.documentElement.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.id = 'shatter-canvas';
    container.appendChild(canvas);

    const btn = document.createElement('button');
    btn.id = 'shatter-btn';
    btn.textContent = 'SHATTER'; // 支离破碎
    container.appendChild(btn);

    const ctx = canvas.getContext('2d');
    let width, height;
    let image;
    let shards = [];
    let isHolding = false;
    let animationId;
    let progress = 0;
    let isResetting = false;

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
    img.src = '/picture/cover.png';
    img.onload = () => {
        image = img;
        resize();
        createShards();
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
            } else {
                // Return to start
                this.currentX += (this.startX - this.currentX) * 0.1;
                this.currentY += (this.startY - this.currentY) * 0.1;
                this.angle *= 0.9;
                this.alpha += (1 - this.alpha) * 0.1;
                this.vx = (Math.random() - 0.5) * EXPLOSION_SPEED; // Reset velocity for next time
                this.vy = (Math.random() - 0.5) * EXPLOSION_SPEED;
            }
        }

        draw() {
            if (this.alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = this.alpha;

            // Move to position and rotate
            ctx.translate(this.currentX, this.currentY);
            ctx.rotate(this.angle);

            // Draw Image Part
            // Clip a triangular or polygonal shape? For simplicity, we use rectangles but rotate them to look like shards.
            // To make it look more like shards, we can use a path.

            ctx.beginPath();
            ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
            ctx.clip();

            // Draw the image segment
            // We need to map the texture coordinates correctly relative to the rotation
            // Actually, simplest way for "shards" without complex UV mapping on rotated context is:
            // Draw image at negative offset of where this shard WAS originally.

            // But since we want the image to "stick" to the shard, we draw the specific chunk of the image.
            ctx.drawImage(image, this.u, this.v, this.uw, this.vh, -this.w / 2, -this.h / 2, this.w, this.h);

            // Glass Reflection Effect
            // Calculate light intensity based on 3D rotation
            // Assume light source is top-left
            const lightX = -0.5;
            const lightY = -0.5;
            const lightZ = 0.7;

            // Normal vector based on rotation
            const nx = Math.sin(this.rotY) * Math.cos(this.rotX);
            const ny = -Math.sin(this.rotX);
            const nz = Math.cos(this.rotY) * Math.cos(this.rotX);

            // Dot product
            const intensity = Math.max(0, nx * lightX + ny * lightY + nz * lightZ);

            if (intensity > 0) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.6})`;
                ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);

                // Specular shine
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
        // Simple grid based shards for now, but with random offsets to look jagged
        const cols = 10;
        const rows = 10;
        const cellW = width / cols;
        const cellH = height / rows;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * cellW + cellW / 2;
                const y = j * cellH + cellH / 2;
                // Randomize size slightly
                const w = cellW * (0.8 + Math.random() * 0.4);
                const h = cellH * (0.8 + Math.random() * 0.4);

                // Image coords
                const u = i * (image.width / cols);
                const v = j * (image.height / rows);
                const uw = image.width / cols;
                const vh = image.height / rows;

                shards.push(new Shard(x, y, w, h, u, v, uw, vh));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        let allGone = true;
        shards.forEach(shard => {
            shard.update(isHolding);
            shard.draw();
            if (shard.alpha > 0) allGone = false;
        });

        if (isHolding && allGone) {
            // Animation complete, remove container?
            // User said: "Finally restores to whole image"
            // So we wait a bit then reset?
            setTimeout(() => {
                isHolding = false;
                btn.classList.remove('hidden');
                btn.textContent = 'RESTORED';
                setTimeout(() => btn.textContent = 'SHATTER', 1000);
            }, 1000);
        }

        animationId = requestAnimationFrame(animate);
    }

    // Interaction
    btn.addEventListener('mousedown', () => {
        isHolding = true;
        btn.classList.add('hidden');
    });

    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isHolding = true;
        btn.classList.add('hidden');
    });

    // If they release, do we stop? User said "Press and hold... starts shattering".
    // If they release, maybe it reverses?
    window.addEventListener('mouseup', () => {
        if (isHolding) {
            // Optional: Reset if they let go early?
            // For now, let's keep it simple: once triggered, it goes? 
            // Or strictly follow "Press and hold".
            // "Press and hold... starts shattering... fragments float away"
            // If I let go, it should probably stop or reverse.
            isHolding = false;
            btn.classList.remove('hidden');
        }
    });

    window.addEventListener('touchend', () => {
        if (isHolding) {
            isHolding = false;
            btn.classList.remove('hidden');
        }
    });

    window.addEventListener('resize', () => {
        resize();
        if (image) createShards();
    });

    animate();
}
