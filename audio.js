/**
 * Web Audio API Sound Synthesizer
 * Zero external audio files required, fully client-side synthetic sound effects.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initialized = false;
    }

    init() {
        if (!this.initialized) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                    this.initialized = true;
                }
            } catch (e) {
                console.warn("AudioContext not supported", e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Subtle click for regular UI interactions
    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    // Pleasant selection chime for selecting options
    playSelect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    // Positive transition chime (Next question)
    playNext() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [440, 554.37, 659.25]; // A major arpeggio
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
            
            gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.1);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + idx * 0.05);
            osc.stop(this.ctx.currentTime + idx * 0.05 + 0.1);
        });
    }

    // Backward transition sound
    playBack() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const notes = [587.33, 440]; // D5 -> A4
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
            
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + idx * 0.04);
            osc.stop(this.ctx.currentTime + idx * 0.04 + 0.08);
        });
    }

    // Grand statistical victory fanfare for survey completion
    playFanfare() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const chord = [
            { f: 523.25, t: 0 },    // C5
            { f: 659.25, t: 0.1 },  // E5
            { f: 783.99, t: 0.2 },  // G5
            { f: 1046.50, t: 0.35 } // C6
        ];

        chord.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, this.ctx.currentTime + item.t);
            
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime + item.t);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + item.t + 0.5);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + item.t);
            osc.stop(this.ctx.currentTime + item.t + 0.5);
        });
    }
}

window.soundEngine = new SoundEngine();
