/**
 * Background Canvas Particles & Gaussian Curve Wave
 * Dark Forest Green & Emerald Edition for INSEA Elections 2026.
 */

class StatisticalBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 42;
        this.mouse = { x: null, y: null, radius: 120 };
        this.time = 0;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    init() {
        this.resize();
        this.particles = [];
        const emeraldShades = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.35 + 0.1,
                color: emeraldShades[Math.floor(Math.random() * emeraldShades.length)]
            });
        }
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawGaussianWave() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const centerY = h * 0.88;
        const amplitude = 55;
        const sigma = w * 0.24;
        const mu = w * 0.5 + Math.sin(this.time * 0.0008) * (w * 0.08);

        this.ctx.beginPath();
        this.ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 6) {
            // Gaussian bell curve formula: exp(- (x - mu)^2 / (2 * sigma^2))
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            const gaussY = amplitude * Math.exp(exponent) * (1 + 0.18 * Math.sin(x * 0.01 + this.time * 0.002));
            const y = centerY - gaussY;
            this.ctx.lineTo(x, y);
        }

        this.ctx.lineTo(w, h);
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(0, centerY - amplitude, 0, h);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Stroke line in emerald
        this.ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
            const gaussY = amplitude * Math.exp(exponent) * (1 + 0.18 * Math.sin(x * 0.01 + this.time * 0.002));
            const y = centerY - gaussY;
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = 'rgba(52, 211, 153, 0.28)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }

    animate() {
        this.time += 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw mathematical background curve
        this.drawGaussianWave();

        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;

            // Connect nearby particles with correlation lines
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = '#10b981';
                    this.ctx.globalAlpha = (1 - dist / 115) * 0.14;
                    this.ctx.lineWidth = 0.75;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1.0;
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.StatisticalBackground = StatisticalBackground;
