/**
 * Lightweight Client-side Confetti & Math Symbol Burst
 * Emerald & Mint Edition for INSEA Survey Completion.
 */

class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.active = false;
        this.mathSymbols = ['Σ', 'π', 'μ', 'p < .05', 'GLM', 'R²', 'θ', 'H₀', 'β₁', 'λ', 'dx', 'DGCT'];
    }

    createCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'confetti-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    fire() {
        this.createCanvas();
        const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#f59e0b', '#06b6d4', '#ffffff'];
        this.particles = [];

        // Generate 130 particles and math symbols
        for (let i = 0; i < 135; i++) {
            const isSymbol = Math.random() < 0.28;
            this.particles.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                y: window.innerHeight * 0.45,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 18 - 4,
                size: isSymbol ? 14 : Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.35,
                opacity: 1,
                decay: Math.random() * 0.008 + 0.006,
                isSymbol: isSymbol,
                symbol: this.mathSymbols[Math.floor(Math.random() * this.mathSymbols.length)]
            });
        }

        this.active = true;
        this.animate();
    }

    animate() {
        if (!this.active || !this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let aliveCount = 0;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotSpeed;
            p.opacity -= p.decay;

            if (p.opacity > 0) {
                aliveCount++;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = Math.max(0, p.opacity);

                if (p.isSymbol) {
                    this.ctx.font = `bold ${p.size}px 'Courier New', monospace`;
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillText(p.symbol, -p.size / 2, p.size / 2);
                } else {
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                }

                this.ctx.restore();
            }
        }

        if (aliveCount > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.active = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

window.confettiEngine = new ConfettiEngine();
