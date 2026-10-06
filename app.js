/**
 * INSEA / DGCT Elections Survey 2026 — Main Application Controller
 * Édition Gamifiée, Pédagogique & Responsive
 */

class InseaSurveyApp {
    constructor() {
        this.currentScreen = 'hero'; // 'hero', 'question', 'outro'
        this.currentQuestionId = null;
        this.answers = {};
        this.historyStack = [];
        this.storageKey = 'insea_dgct_elections_survey_2026';
        
        this.initElements();
        this.loadPersistedState();
        this.bindGlobalEvents();
    }

    initElements() {
        this.heroScreen = document.getElementById('hero-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.outroScreen = document.getElementById('outro-screen');
        
        this.progressBarContainer = document.getElementById('progress-bar-container');
        this.progressBarFill = document.getElementById('progress-bar-fill');
        this.progressLabel = document.getElementById('progress-label');
        this.stageStepper = document.getElementById('stage-stepper');

        this.blockBadge = document.getElementById('block-badge');
        this.questionTitle = document.getElementById('question-title');
        this.questionSubtitle = document.getElementById('question-subtitle');
        this.questionContent = document.getElementById('question-content');
        this.commentaryBox = document.getElementById('commentary-box');
        this.commentaryText = document.getElementById('commentary-text');

        this.btnBack = document.getElementById('btn-back');
        this.btnNext = document.getElementById('btn-next');
        this.btnNextText = document.getElementById('btn-next-text');

        this.soundToggleBtn = document.getElementById('sound-toggle-btn');
        this.soundIcon = document.getElementById('sound-icon');
    }

    loadPersistedState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.answers) {
                    this.answers = parsed.answers;
                }
            }
        } catch (e) {
            console.warn("Impossible de charger les réponses", e);
        }
    }

    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                answers: this.answers,
                updatedAt: new Date().toISOString()
            }));
        } catch (e) {
            console.warn("Échec d'enregistrement local", e);
        }
    }

    clearState() {
        this.answers = {};
        this.historyStack = [];
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {}
    }

    bindGlobalEvents() {
        // Sound toggle
        if (this.soundToggleBtn) {
            this.soundToggleBtn.addEventListener('click', () => {
                const isEnabled = window.soundEngine.toggle();
                this.updateSoundIcon(isEnabled);
                if (isEnabled) window.soundEngine.playClick();
            });
        }

        // Global Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
            if (e.target.tagName === 'TEXTAREA') return;

            if (this.currentScreen === 'hero' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.startSurvey();
            } else if (this.currentScreen === 'question') {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNext();
                } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
                    if (this.historyStack.length > 0) {
                        e.preventDefault();
                        this.handleBack();
                    }
                } else if (/^[1-9]$/.test(e.key)) {
                    this.handleNumericShortcut(parseInt(e.key, 10));
                }
            }
        });

        // Start button in Hero
        const btnStart = document.getElementById('btn-start-survey');
        if (btnStart) {
            btnStart.addEventListener('click', () => this.startSurvey());
        }

        // Navigation buttons
        if (this.btnBack) {
            this.btnBack.addEventListener('click', () => this.handleBack());
        }
        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => this.handleNext());
        }
    }

    updateSoundIcon(enabled) {
        if (!this.soundIcon) return;
        if (enabled) {
            this.soundIcon.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path></svg>`;
        } else {
            this.soundIcon.innerHTML = `<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>`;
        }
    }

    startSurvey() {
        window.soundEngine.playNext();
        this.currentScreen = 'question';
        this.currentQuestionId = 'q1_age';
        this.historyStack = [];

        this.heroScreen.classList.add('hidden');
        this.outroScreen.classList.add('hidden');
        this.questionScreen.classList.remove('hidden');
        this.progressBarContainer.classList.remove('hidden');

        this.renderQuestion('q1_age', 'right');
    }

    renderQuestion(qId, direction = 'right') {
        const qConfig = SURVEY_DATA.questions[qId];
        if (!qConfig) {
            console.error("Question non trouvée:", qId);
            return;
        }

        this.currentQuestionId = qId;

        // Apply slide animation
        const mainCard = document.getElementById('question-card');
        if (mainCard) {
            mainCard.className = `glass-card rounded-3xl p-6 sm:p-8 max-w-3xl w-full mx-auto relative ${
                direction === 'right' ? 'slide-in-right' : 'slide-in-left'
            }`;
        }

        // Update Block header
        this.blockBadge.innerHTML = `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ${qConfig.blockName}
            </span>
        `;
        this.questionTitle.textContent = qConfig.title;
        this.questionSubtitle.textContent = qConfig.subtitle;

        // Render controls
        this.questionContent.innerHTML = '';
        this.renderQuestionControls(qConfig);

        // Render Methodo Tip if available
        this.renderMethodoTip(qConfig);

        // Update progress bar & visual stages
        this.updateProgress();

        // Update navigation button states
        this.updateNavButtons(qConfig);

        // Refresh icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    renderMethodoTip(qConfig) {
        const existingTip = document.getElementById('methodo-tip-container');
        if (existingTip) existingTip.remove();

        if (qConfig.methodoTip) {
            const tipBox = document.createElement('div');
            tipBox.id = 'methodo-tip-container';
            tipBox.className = 'mt-3 methodo-card p-3 flex items-start gap-2.5 text-[11px] text-emerald-300/80 font-mono';
            tipBox.innerHTML = `
                <span class="text-sm flex-shrink-0">🎓</span>
                <div class="flex-1 leading-relaxed">
                    <span class="font-bold text-emerald-200">Note Pédagogique INSEA :</span>
                    ${qConfig.methodoTip.replace('🔬 Note INSEA :', '')}
                </div>
            `;
            this.questionContent.appendChild(tipBox);
        }
    }

    renderQuestionControls(qConfig) {
        const currentValue = this.answers[qConfig.id];

        switch (qConfig.type) {
            case 'slider_number':
                this.renderSliderNumber(qConfig, currentValue);
                break;
            case 'cards_single':
            case 'branching_choice':
                this.renderCardsChoice(qConfig, currentValue);
                break;
            case 'rating_stars':
                this.renderRatingStars(qConfig, currentValue);
                break;
            case 'textarea_math':
                this.renderTextareaMath(qConfig, currentValue);
                break;
            default:
                console.warn("Type de question inconnu", qConfig.type);
        }

        if (currentValue !== undefined && currentValue !== null && currentValue !== "") {
            this.showCommentary(qConfig.commentary(currentValue));
        } else {
            this.hideCommentary();
        }
    }

    // 1. Slider Number Renderer (Q1 Age)
    renderSliderNumber(qConfig, currentValue) {
        const val = currentValue !== undefined ? currentValue : qConfig.default;
        this.answers[qConfig.id] = val;

        const container = document.createElement('div');
        container.className = "flex flex-col items-center gap-6 my-4";

        container.innerHTML = `
            <div class="flex items-baseline justify-center gap-3">
                <span id="slider-display-val" class="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent font-mono">
                    ${val}
                </span>
                <span class="text-2xl font-semibold text-emerald-200/80">ans</span>
            </div>

            <div class="w-full max-w-lg px-4 flex flex-col gap-2">
                <input type="range" id="slider-input" min="${qConfig.min}" max="${qConfig.max}" value="${val}" class="w-full">
                <div class="flex justify-between text-xs text-emerald-300/60 font-mono">
                    <span>${qConfig.min} ans (Majorité)</span>
                    <span>50 ans</span>
                    <span>${qConfig.max} ans</span>
                </div>
            </div>

            <div class="flex flex-wrap justify-center gap-2 mt-2">
                <span class="text-xs text-slate-400 self-center mr-2 font-mono">Raccourcis :</span>
                ${qConfig.presets.map(p => `
                    <button type="button" class="preset-btn px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                        p === Number(val) 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                        : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-800/60'
                    }" data-val="${p}">${p} ans</button>
                `).join('')}
            </div>
        `;

        this.questionContent.appendChild(container);

        const slider = container.querySelector('#slider-input');
        const display = container.querySelector('#slider-display-val');

        const updateVal = (newVal) => {
            const num = parseInt(newVal, 10);
            this.answers[qConfig.id] = num;
            display.textContent = num;
            this.showCommentary(qConfig.commentary(num));
            this.saveState();

            container.querySelectorAll('.preset-btn').forEach(btn => {
                const btnVal = parseInt(btn.getAttribute('data-val'), 10);
                if (btnVal === num) {
                    btn.className = "preset-btn px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all bg-emerald-600 text-white shadow-lg shadow-emerald-600/30";
                } else {
                    btn.className = "preset-btn px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-800/60";
                }
            });
        };

        slider.addEventListener('input', (e) => {
            window.soundEngine.playClick();
            updateVal(e.target.value);
        });

        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pVal = btn.getAttribute('data-val');
                slider.value = pVal;
                window.soundEngine.playSelect();
                updateVal(pVal);
            });
        });
    }

    // 2. Cards Single Choice & Branching
    renderCardsChoice(qConfig, currentValue) {
        const gridCols = qConfig.gridCols || 1;
        const gridClass = gridCols === 3 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 my-3' 
            : (gridCols === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3' : 'flex flex-col gap-3 my-3');

        const container = document.createElement('div');
        container.className = gridClass;

        qConfig.options.forEach((opt, idx) => {
            const isSelected = currentValue === opt.value;
            const themeClass = opt.theme ? `theme-${opt.theme}` : '';
            const shortcutNum = idx + 1;

            const card = document.createElement('div');
            card.className = `option-card ${isSelected ? 'selected ' + themeClass : ''}`;
            card.setAttribute('data-value', opt.value);
            card.setAttribute('data-index', shortcutNum);

            card.innerHTML = `
                <div class="text-3xl sm:text-4xl flex-shrink-0 p-1 select-none">${opt.icon}</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <h4 class="font-semibold text-slate-100 text-sm sm:text-base leading-snug">${opt.label}</h4>
                        ${opt.badge ? `<span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40 flex-shrink-0">${opt.badge}</span>` : ''}
                    </div>
                    ${opt.desc ? `<p class="text-xs text-slate-300/80 mt-0.5 leading-normal font-light">${opt.desc}</p>` : ''}
                </div>
                <div class="key-badge hidden sm:block">${shortcutNum}</div>
            `;

            card.addEventListener('click', () => {
                this.selectCardOption(qConfig, opt.value, card, container);
            });

            container.appendChild(card);
        });

        this.questionContent.appendChild(container);
    }

    selectCardOption(qConfig, value, selectedCard, container) {
        window.soundEngine.playSelect();
        this.answers[qConfig.id] = value;
        this.saveState();

        container.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected', 'theme-rose', 'theme-amber'));
        const opt = qConfig.options.find(o => o.value === value);
        if (opt && opt.theme) {
            selectedCard.classList.add('selected', `theme-${opt.theme}`);
        } else {
            selectedCard.classList.add('selected');
        }

        this.showCommentary(qConfig.commentary(value));

        setTimeout(() => {
            this.handleNext();
        }, 320);
    }

    // 3. Rating Stars / Likert Step (1-5)
    renderRatingStars(qConfig, currentValue) {
        const val = currentValue !== undefined ? parseInt(currentValue, 10) : qConfig.default;
        this.answers[qConfig.id] = val;

        const container = document.createElement('div');
        container.className = "flex flex-col items-center gap-6 my-6";

        const starButtons = [];
        for (let i = qConfig.min; i <= qConfig.max; i++) {
            starButtons.push(`
                <button type="button" class="star-btn flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${i === val ? 'active' : 'text-slate-600'}" data-val="${i}">
                    <span class="text-3xl sm:text-4xl">${i <= val ? '★' : '☆'}</span>
                    <span class="text-xs font-mono font-bold text-emerald-300/70">${i}</span>
                </button>
            `);
        }

        container.innerHTML = `
            <div class="flex justify-center items-center gap-2 sm:gap-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                ${starButtons.join('')}
            </div>

            <div id="rating-desc" class="text-center px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium max-w-lg shadow-sm">
                ${qConfig.labels ? qConfig.labels[val] : `Niveau ${val} sur ${qConfig.max}`}
            </div>
        `;

        this.questionContent.appendChild(container);

        const ratingDesc = container.querySelector('#rating-desc');
        container.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = parseInt(btn.getAttribute('data-val'), 10);
                window.soundEngine.playSelect();
                this.answers[qConfig.id] = chosen;
                this.saveState();

                container.querySelectorAll('.star-btn').forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-val'), 10);
                    const starIcon = s.querySelector('span');
                    if (sVal <= chosen) {
                        s.classList.add('active');
                        s.classList.remove('text-slate-600');
                        starIcon.textContent = '★';
                    } else {
                        s.classList.remove('active');
                        s.classList.add('text-slate-600');
                        starIcon.textContent = '☆';
                    }
                });

                if (qConfig.labels) {
                    ratingDesc.textContent = qConfig.labels[chosen];
                }
                this.showCommentary(qConfig.commentary(chosen));
            });
        });
    }

    // 4. Textarea with Shortcuts (Q19)
    renderTextareaMath(qConfig, currentValue) {
        const val = currentValue || '';

        const container = document.createElement('div');
        container.className = "flex flex-col gap-4 my-2";

        container.innerHTML = `
            <div class="flex flex-wrap items-center gap-1.5 pb-1 border-b border-emerald-800/40">
                <span class="text-xs text-emerald-300/80 font-mono mr-2">Idées suggérées :</span>
                ${qConfig.mathShortcuts.map(s => `
                    <button type="button" class="math-chip" data-sym="${s}">${s}</button>
                `).join('')}
            </div>

            <div class="relative">
                <textarea id="math-textarea" rows="4" maxlength="500" 
                    placeholder="${qConfig.placeholder}"
                    class="w-full bg-[#08160f] border border-emerald-800/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-none font-sans"
                >${val}</textarea>
                <div class="flex justify-between items-center mt-1.5 text-xs text-emerald-300/60 font-mono">
                    <span>💡 Vos propositions libres seront transmises dans le rapport de synthèse.</span>
                    <span id="char-counter">${val.length}/500</span>
                </div>
            </div>
        `;

        this.questionContent.appendChild(container);

        const textarea = container.querySelector('#math-textarea');
        const charCounter = container.querySelector('#char-counter');

        textarea.addEventListener('input', (e) => {
            this.answers[qConfig.id] = e.target.value;
            charCounter.textContent = `${e.target.value.length}/500`;
            this.saveState();
            if (e.target.value.length > 5) {
                this.showCommentary(qConfig.commentary(e.target.value));
            }
        });

        container.querySelectorAll('.math-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const sym = chip.getAttribute('data-sym');
                window.soundEngine.playClick();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                textarea.value = text.substring(0, start) + sym + (text.length > 0 ? " " : "") + text.substring(end);
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + sym.length + 1;
                this.answers[qConfig.id] = textarea.value;
                charCounter.textContent = `${textarea.value.length}/500`;
                this.saveState();
            });
        });
    }

    handleNumericShortcut(num) {
        const qConfig = SURVEY_DATA.questions[this.currentQuestionId];
        if (!qConfig) return;

        if (qConfig.type === 'cards_single' || qConfig.type === 'branching_choice') {
            const card = this.questionContent.querySelector(`.option-card[data-index="${num}"]`);
            if (card) {
                const value = card.getAttribute('data-value');
                this.selectCardOption(qConfig, value, card, this.questionContent);
            }
        } else if (qConfig.type === 'rating_stars') {
            const star = this.questionContent.querySelector(`.star-btn[data-val="${num}"]`);
            if (star) {
                star.click();
            }
        }
    }

    showCommentary(text) {
        if (!text || !this.commentaryBox || !this.commentaryText) return;
        this.commentaryText.innerHTML = text;
        this.commentaryBox.classList.remove('hidden');
    }

    hideCommentary() {
        if (this.commentaryBox) {
            this.commentaryBox.classList.add('hidden');
        }
    }

    updateProgress() {
        const progress = SURVEY_DATA.calculateProgress(this.currentQuestionId, this.answers);
        if (this.progressBarFill) {
            this.progressBarFill.style.width = `${progress.percentage}%`;
        }
        if (this.progressLabel) {
            this.progressLabel.textContent = `${progress.percentage}% complété`;
        }

        // Update Stage Stepper pills
        if (this.stageStepper) {
            const currentQ = SURVEY_DATA.questions[this.currentQuestionId];
            const activeStage = currentQ ? currentQ.stageId : 'profil';

            this.stageStepper.querySelectorAll('.step-pill').forEach(pill => {
                const stage = pill.getAttribute('data-stage');
                if (stage === activeStage) {
                    pill.className = "step-pill px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 transition-all scale-105";
                } else {
                    pill.className = "step-pill px-2 py-1 rounded-full text-[11px] font-medium bg-[#12281d] text-emerald-300/70 border border-emerald-800/40 transition-all";
                }
            });
        }
    }

    updateNavButtons(qConfig) {
        if (this.historyStack.length > 0) {
            this.btnBack.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            this.btnBack.classList.add('opacity-0', 'pointer-events-none');
        }

        if (qConfig.next === null) {
            this.btnNextText.textContent = "Découvrir mon Diagnostic Citoyen 🎉 [ Entrée ↵ ]";
            this.btnNext.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-teal-500');
        } else {
            this.btnNextText.textContent = "Suivant [ Entrée ↵ ]";
            this.btnNext.classList.remove('bg-gradient-to-r', 'from-emerald-500', 'to-teal-500');
        }
    }

    handleNext() {
        const qConfig = SURVEY_DATA.questions[this.currentQuestionId];
        if (!qConfig) return;

        if (this.answers[qConfig.id] === undefined || this.answers[qConfig.id] === null || this.answers[qConfig.id] === "") {
            if (qConfig.type === 'slider_number') {
                this.answers[qConfig.id] = qConfig.default;
            } else if (qConfig.type === 'rating_stars') {
                this.answers[qConfig.id] = qConfig.default;
            } else if (qConfig.type !== 'textarea_math') {
                window.soundEngine.playClick();
                const card = document.getElementById('question-card');
                if (card) {
                    card.classList.add('ring-2', 'ring-rose-500/50');
                    setTimeout(() => card.classList.remove('ring-2', 'ring-rose-500/50'), 400);
                }
                return;
            }
        }

        this.historyStack.push(this.currentQuestionId);

        let nextQId = null;
        if (typeof qConfig.next === 'function') {
            nextQId = qConfig.next(this.answers);
        } else {
            nextQId = qConfig.next;
        }

        if (nextQId) {
            window.soundEngine.playNext();
            this.renderQuestion(nextQId, 'right');
        } else {
            this.finishSurvey();
        }
    }

    handleBack() {
        if (this.historyStack.length === 0) return;
        window.soundEngine.playBack();
        const prevQId = this.historyStack.pop();
        this.renderQuestion(prevQId, 'left');
    }

    finishSurvey() {
        window.soundEngine.playFanfare();
        window.confettiEngine.fire();

        this.currentScreen = 'outro';
        this.questionScreen.classList.add('hidden');
        this.progressBarContainer.classList.add('hidden');
        this.outroScreen.classList.remove('hidden');

        this.renderOutroDashboard();
    }

    renderOutroDashboard() {
        const profile = window.StatisticalProfiler.generateProfile(this.answers);
        
        const profileTitle = document.getElementById('profile-title');
        const profileSubtitle = document.getElementById('profile-subtitle');
        const profileQuote = document.getElementById('profile-quote');
        const profileBadge = document.getElementById('profile-badge');
        const statProba = document.getElementById('stat-proba');
        const statLogit = document.getElementById('stat-logit');

        if (profileTitle) profileTitle.textContent = profile.title;
        if (profileSubtitle) profileSubtitle.textContent = profile.subtitle;
        if (profileQuote) profileQuote.textContent = profile.quote;
        if (profileBadge) profileBadge.textContent = profile.badge;
        if (statProba) statProba.textContent = `${profile.probaPercent}%`;
        if (statLogit) statLogit.textContent = profile.logitScore;

        const summaryGrid = document.getElementById('summary-grid');
        if (summaryGrid) {
            summaryGrid.innerHTML = '';
            const keyMappings = [
                { k: 'q1_age', label: 'Âge', fmt: v => `${v} ans` },
                { k: 'q2_sexe', label: 'Sexe', fmt: v => v.toUpperCase() },
                { k: 'q3_situation_pro', label: 'Situation Pro.', fmt: v => v.replace(/_/g, ' ').toUpperCase() },
                { k: 'q4_niveau_etudes', label: 'Niveau Études', fmt: v => v.replace(/_/g, ' ').toUpperCase() },
                { k: 'q5_residence', label: 'Milieu Résidence', fmt: v => v === 'mre' || v === 'MRE' ? '✈️ MRE (Étranger)' : v.toUpperCase() },
                { k: 'q8_inscription', label: 'Statut Inscription', fmt: v => v === 'ineligible' || v === 'INELIGIBLE' ? '🛡️ NON-ÉLIGIBLE (Forces armées)' : (v === 'non_inscrit_mre' || v === 'NON_INSCRIT_MRE' ? '✈️ Non-Inscrit (MRE)' : (v === 'inscrit' ? 'Inscrit(e)' : 'Non-inscrit')) },
                { k: 'q9_vote', label: 'Vote Législatives 2026', fmt: v => v === 'oui' ? '✅ A voté' : (v === 'non' ? '🛑 Non voté' : (this.answers['q8_inscription'] === 'ineligible' ? '🛡️ Non applicable (Non-éligible)' : '🔒 Secret')) },
                { k: 'q15_confiance', label: 'Confiance Scrutin', fmt: v => `${v}/5` }
            ];

            keyMappings.forEach(item => {
                if (this.answers[item.k] !== undefined) {
                    const div = document.createElement('div');
                    div.className = "bg-[#08160f] border border-emerald-800/40 rounded-xl p-3 flex flex-col justify-between shadow-sm";
                    div.innerHTML = `
                        <span class="text-[11px] font-mono text-emerald-300/70">${item.label}</span>
                        <span class="text-sm font-semibold text-emerald-200 mt-1">${item.fmt(this.answers[item.k])}</span>
                    `;
                    summaryGrid.appendChild(div);
                }
            });
        }

        // WhatsApp Share Handler
        const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
        if (btnShareWhatsapp) {
            btnShareWhatsapp.onclick = () => {
                window.soundEngine.playSelect();
                const shareText = encodeURIComponent(
                    `🗳️ J'ai complété mon Diagnostic Citoyen sur l'enquête Législatives 2026 de l'INSEA ! Mon profil : "${profile.title}". Ça prend 3 min et c'est super interactif, découvre ton profil ici : ` + window.location.href
                );
                window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
            };
        }

        // Export Actions
        const btnExportJson = document.getElementById('btn-export-json');
        const btnExportCsv = document.getElementById('btn-export-csv');
        const btnExportR = document.getElementById('btn-export-r');
        const btnRestart = document.getElementById('btn-restart-survey');

        if (btnExportJson) {
            btnExportJson.onclick = () => {
                window.soundEngine.playSelect();
                window.StatisticalProfiler.exportJSON(this.answers);
            };
        }

        if (btnExportCsv) {
            btnExportCsv.onclick = () => {
                window.soundEngine.playSelect();
                window.StatisticalProfiler.exportCSV(this.answers);
            };
        }

        if (btnExportR) {
            btnExportR.onclick = () => {
                window.soundEngine.playSelect();
                window.StatisticalProfiler.generateRScript(this.answers);
            };
        }

        if (btnRestart) {
            btnRestart.onclick = () => {
                window.soundEngine.playClick();
                this.clearState();
                this.startSurvey();
            };
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new window.StatisticalBackground('bg-canvas');

    if (window.lucide) {
        window.lucide.createIcons();
    }

    window.app = new InseaSurveyApp();
});
