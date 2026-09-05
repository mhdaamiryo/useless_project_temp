/**
 * POTATO DRAMA ANALYTICS™ — CORE CLIENT ENGINE (v4.2)
 * Features: Ambient Canvas Mesh, File Vault Dropzone, Telemetry Terminal Loader,
 *           SVG Reticle Canvas Overlay, 3D Tilt Dossier Cards, Potato Court Tribunal.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        currentStep: 'IDLE', // IDLE | PROCESSING | RESULTS
        imageDataUrl: null,
        detectedSpuds: [],
        winnerSpud: null,
        activeSpudId: null
    };

    // --- DOM ELEMENTS ---
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const btnScan = document.getElementById('btnScan');
    const btnSample = document.getElementById('btnSample');
    const btnRescan = document.getElementById('btnRescan');
    
    const uploadSection = document.getElementById('uploadSection');
    const resultsSection = document.getElementById('resultsSection');
    
    const analysisModal = document.getElementById('analysisModal');
    const radarPercent = document.getElementById('radarProgressPercent');
    const terminalLog = document.getElementById('terminalLog');

    const uploadedImage = document.getElementById('uploadedImage');
    const reticleOverlay = document.getElementById('reticleOverlay');
    const spudGrid = document.getElementById('spudGrid');

    const winnerId = document.getElementById('winnerId');
    const winnerTitle = document.getElementById('winnerTitle');
    const winnerScore = document.getElementById('winnerScore');
    const winnerQuoteText = document.getElementById('winnerQuoteText');

    const statDetectedCount = document.getElementById('statDetectedCount');
    const statAvgDrama = document.getElementById('statAvgDrama');
    const statTraumaLevel = document.getElementById('statTraumaLevel');

    const selectSpudA = document.getElementById('selectSpudA');
    const selectSpudB = document.getElementById('selectSpudB');
    const fighterACard = document.getElementById('fighterACard');
    const fighterBCard = document.getElementById('fighterBCard');
    const btnAdjudicate = document.getElementById('btnAdjudicate');
    const verdictBox = document.getElementById('verdictBox');
    const verdictWinnerText = document.getElementById('verdictWinnerText');
    const verdictReason = document.getElementById('verdictReason');

    // --- AMBIENT CANVAS BACKGROUND ---
    initAmbientBackground();

    // --- EVENT LISTENERS ---
    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.parentElement.style.borderColor = 'var(--glowing-cyan)';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.parentElement.style.borderColor = 'rgba(255, 157, 0, 0.4)';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.parentElement.style.borderColor = 'rgba(255, 157, 0, 0.4)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    btnScan.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    btnSample.addEventListener('click', (e) => {
        e.stopPropagation();
        loadSampleSpuds();
    });

    btnRescan.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        state.currentStep = 'IDLE';
    });

    selectSpudA.addEventListener('change', updateCourtFighters);
    selectSpudB.addEventListener('change', updateCourtFighters);
    btnAdjudicate.addEventListener('click', runCourtTrial);

    // --- FILE UPLOAD HANDLER WITH COMPRESSION/RESIZE ---
    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Compress/Resize on client canvas to max 1200px
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxDim = 1200;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                state.imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                startAnalysisPipeline(file.name || 'uploaded_spud.jpg');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // --- SAMPLE SPUDS GENERATOR ---
    function loadSampleSpuds() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Draw futuristic spud laboratory backdrop
        const grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 400);
        grad.addColorStop(0, '#1e1b18');
        grad.addColorStop(1, '#0a0a0f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 157, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
        }
        for (let y = 0; y < 600; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
        }

        // Draw 4 realistic potato shapes
        const spudsPos = [
            { x: 220, y: 240, rx: 90, ry: 70, rot: -0.2, color: '#a07844', label: 'Potato #1' },
            { x: 550, y: 220, rx: 110, ry: 80, rot: 0.3, color: '#8c6434', label: 'Potato #2' },
            { x: 300, y: 440, rx: 80, ry: 60, rot: 0.1, color: '#b58a4d', label: 'Potato #3' },
            { x: 580, y: 420, rx: 100, ry: 85, rot: -0.4, color: '#7a5228', label: 'Potato #4' }
        ];

        spudsPos.forEach(s => {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rot);
            ctx.beginPath();
            ctx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.stroke();

            // Draw eyes / dimples
            ctx.fillStyle = '#4a3215';
            for (let i = 0; i < 5; i++) {
                const ex = (Math.sin(i * 2) * s.rx * 0.6);
                const ey = (Math.cos(i * 1.5) * s.ry * 0.6);
                ctx.beginPath();
                ctx.arc(ex, ey, 4 + (i % 3), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        state.imageDataUrl = canvas.toDataURL('image/jpeg');
        startAnalysisPipeline('sample_vault_spuds.jpg');
    }

    // --- ANALYSIS MODAL TELEMETRY SCANNER ---
    function startAnalysisPipeline(fileName) {
        state.currentStep = 'PROCESSING';
        analysisModal.classList.remove('hidden');
        terminalLog.textContent = '';

        const logs = [
            `⚡ [SYSTEM]: Initializing Neural Drama Engine v4.2...`,
            `🔍 [CV-MODULE]: Ingesting photo buffer: "${fileName}"`,
            `🧠 [NEURAL]: Locating root vegetable bounding coordinates...`,
            `🎭 [METRICS]: Measuring shape irregularity & contour distress...`,
            `🧪 [SPECTRA]: Calculating surface trauma & laplacian complexity...`,
            `⚖️ [TRIBUNAL]: Consulting the Root Vegetable Drama Court...`,
            `✅ [STATUS]: Telemetry complete. Generating spud dossiers.`
        ];

        let index = 0;
        let progress = 0;

        const interval = setInterval(() => {
            if (index < logs.length) {
                terminalLog.textContent += logs[index] + '\n';
                terminalLog.scrollTop = terminalLog.scrollHeight;
                index++;
                progress = Math.min(100, Math.round((index / logs.length) * 100));
                radarPercent.textContent = `${progress}%`;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    analysisModal.classList.add('hidden');
                    renderResults(fileName);
                }, 600);
            }
        }, 650);
    }

    // --- MOCK DRAMA ENGINE (DETERMINISTIC PER IMAGE/FILE HASH) ---
    function generateSpudTelemetry(fileName) {
        const hash = simpleHash(fileName + state.imageDataUrl.length);
        const count = 4; // 4 detected potatoes

        const personas = [
            { title: "THE TRAGIC HERO", quote: "Has witnessed peeling pressures no spud should ever endure." },
            { title: "SUSPICIOUS SPUD", quote: "Eyeball contours suggest extreme hyper-vigilance against mashes." },
            { title: "THE SILENT WITNESS", quote: "Stoic exterior hiding deep subterranean anxiety." },
            { title: "EMOTIONALLY STABLE", quote: "Surprisingly calm despite impending boil threats." }
        ];

        const spuds = [];

        // Reticle coordinates as percentages (xmin, ymin, width, height)
        const coords = [
            { x: 15, y: 25, w: 32, h: 32 },
            { x: 55, y: 20, w: 36, h: 35 },
            { x: 25, y: 58, w: 30, h: 30 },
            { x: 58, y: 55, w: 35, h: 36 }
        ];

        for (let i = 0; i < count; i++) {
            const seed = (hash + i * 13) % 100;
            const dramaScore = i === 3 ? 96.8 : parseFloat((35 + (seed * 0.55)).toFixed(1));
            
            spuds.push({
                id: `POTATO #${i + 1}`,
                num: i + 1,
                coord: coords[i],
                dramaScore: dramaScore,
                irregularity: Math.round(40 + (seed * 0.5)),
                complexity: Math.round(30 + ((seed * 17) % 65)),
                uniqueness: Math.round(50 + ((seed * 23) % 48)),
                persona: personas[i].title,
                quote: personas[i].quote
            });
        }

        // Sort descending by drama score to pick winner
        spuds.sort((a, b) => b.dramaScore - a.dramaScore);

        // Fallback safety if 0 spuds (Mitigation requirement from spec)
        if (spuds.length === 0) {
            spuds.push({
                id: "POTATO #0",
                num: 0,
                coord: { x: 25, y: 25, w: 50, h: 50 },
                dramaScore: 99.9,
                irregularity: 99,
                complexity: 99,
                uniqueness: 99,
                persona: "STEALTHED DRAMA KING",
                quote: "Invisible spud detected in high-dimensional space."
            });
        }

        return spuds;
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    // --- RENDER RESULTS DASHBOARD ---
    function renderResults(fileName) {
        state.currentStep = 'RESULTS';
        uploadSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        // Set image source
        uploadedImage.src = state.imageDataUrl;

        // Generate Spuds
        state.detectedSpuds = generateSpudTelemetry(fileName);
        state.winnerSpud = state.detectedSpuds[0];

        // Update Winner Banner
        winnerId.textContent = state.winnerSpud.id;
        winnerTitle.textContent = `"${state.winnerSpud.persona}"`;
        winnerScore.textContent = `${state.winnerSpud.dramaScore}%`;
        winnerQuoteText.textContent = `"${state.winnerSpud.quote}"`;

        // Update Summary Stats
        statDetectedCount.textContent = state.detectedSpuds.length;
        const avg = (state.detectedSpuds.reduce((acc, s) => acc + s.dramaScore, 0) / state.detectedSpuds.length).toFixed(1);
        statAvgDrama.textContent = `${avg}%`;
        statTraumaLevel.textContent = avg > 70 ? 'CRITICAL' : 'ELEVATED';

        // Draw Canvas Bounding Reticles once image loads
        uploadedImage.onload = () => drawReticleOverlay();
        drawReticleOverlay();

        // Render Leaderboard Grid Cards
        renderSpudGrid();

        // Populate Potato Court Dropdowns
        populateCourtDropdowns();
    }

    // --- SVG RETICLE OVERLAY MAPPER ---
    function drawReticleOverlay() {
        reticleOverlay.innerHTML = '';
        const viewBox = `0 0 100 100`;
        reticleOverlay.setAttribute('viewBox', viewBox);
        reticleOverlay.setAttribute('preserveAspectRatio', 'none');

        state.detectedSpuds.forEach(spud => {
            const { x, y, w, h } = spud.coord;

            // Reticle Group
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'reticle-group');
            g.setAttribute('data-id', spud.id);

            // Bounding Box Rect
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', w);
            rect.setAttribute('height', h);
            rect.setAttribute('class', `reticle-rect ${spud.id === state.winnerSpud.id ? 'active' : ''}`);

            // Label BG
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            labelBg.setAttribute('x', x);
            labelBg.setAttribute('y', y);
            labelBg.setAttribute('width', Math.min(w, 28));
            labelBg.setAttribute('height', 4.5);
            labelBg.setAttribute('class', 'reticle-label-bg');

            // Label Text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + 1);
            text.setAttribute('y', y + 3.4);
            text.setAttribute('class', 'reticle-label');
            text.textContent = `${spud.id} (${spud.dramaScore}%)`;

            g.appendChild(rect);
            g.appendChild(labelBg);
            g.appendChild(text);

            // Hover sync with dossier card
            g.addEventListener('mouseenter', () => highlightSpudCard(spud.id));
            g.addEventListener('mouseleave', () => clearHighlights());
            g.addEventListener('click', () => {
                highlightSpudCard(spud.id);
                const el = document.getElementById(`card-${spud.id.replace('#', '').replace(' ', '')}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            reticleOverlay.appendChild(g);
        });
    }

    // --- LEADERBOARD GRID CARDS RENDERER ---
    function renderSpudGrid() {
        spudGrid.innerHTML = '';

        state.detectedSpuds.forEach(spud => {
            const cardId = `card-${spud.id.replace('#', '').replace(' ', '')}`;
            const card = document.createElement('div');
            card.id = cardId;
            card.className = 'spud-card';

            const strokeDashOffset = 188 - (188 * spud.dramaScore / 100);

            card.innerHTML = `
                <div class="spud-card-header">
                    <span class="spud-id-tag">${spud.id}</span>
                    <span class="persona-badge">${spud.persona}</span>
                </div>
                <div class="spud-card-body">
                    <div class="score-dial-wrapper">
                        <svg class="dial-svg" viewBox="0 0 70 70">
                            <circle class="dial-bg" cx="35" cy="35" r="30"/>
                            <circle class="dial-meter" cx="35" cy="35" r="30" style="stroke-dashoffset: ${strokeDashOffset};"/>
                        </svg>
                        <span class="dial-score-text">${spud.dramaScore}%</span>
                    </div>
                    <div class="metrics-list">
                        <div class="metric-row">
                            <div class="metric-meta"><span>Irregularity</span><span>${spud.irregularity}%</span></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${spud.irregularity}%"></div></div>
                        </div>
                        <div class="metric-row">
                            <div class="metric-meta"><span>Complexity</span><span>${spud.complexity}%</span></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${spud.complexity}%"></div></div>
                        </div>
                        <div class="metric-row">
                            <div class="metric-meta"><span>Uniqueness</span><span>${spud.uniqueness}%</span></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${spud.uniqueness}%"></div></div>
                        </div>
                    </div>
                </div>
                <div class="spud-card-footer">
                    "${spud.quote}"
                </div>
            `;

            // Add 3D Tilt Effect on mousemove
            init3DTilt(card);

            card.addEventListener('mouseenter', () => {
                highlightReticle(spud.id);
            });
            card.addEventListener('mouseleave', () => {
                clearHighlights();
            });

            spudGrid.appendChild(card);
        });
    }

    // --- 3D CARD TILT FX ---
    function init3DTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }

    // --- HIGHLIGHT SYNC ---
    function highlightSpudCard(id) {
        document.querySelectorAll('.spud-card').forEach(c => c.classList.remove('highlighted'));
        const cardId = `card-${id.replace('#', '').replace(' ', '')}`;
        const card = document.getElementById(cardId);
        if (card) card.classList.add('highlighted');
        highlightReticle(id);
    }

    function highlightReticle(id) {
        document.querySelectorAll('.reticle-rect').forEach(r => r.classList.remove('active'));
        const groups = document.querySelectorAll('.reticle-group');
        groups.forEach(g => {
            if (g.getAttribute('data-id') === id) {
                const rect = g.querySelector('.reticle-rect');
                if (rect) rect.classList.add('active');
            }
        });
    }

    function clearHighlights() {
        document.querySelectorAll('.spud-card').forEach(c => c.classList.remove('highlighted'));
        document.querySelectorAll('.reticle-rect').forEach(r => r.classList.remove('active'));
        // Re-highlight winner
        if (state.winnerSpud) highlightReticle(state.winnerSpud.id);
    }

    // --- POTATO COURT TRIBUNAL LOGIC ---
    function populateCourtDropdowns() {
        selectSpudA.innerHTML = '';
        selectSpudB.innerHTML = '';

        state.detectedSpuds.forEach((spud, idx) => {
            const optA = document.createElement('option');
            optA.value = spud.id;
            optA.textContent = `${spud.id} — ${spud.persona} (${spud.dramaScore}%)`;
            selectSpudA.appendChild(optA);

            const optB = document.createElement('option');
            optB.value = spud.id;
            optB.textContent = `${spud.id} — ${spud.persona} (${spud.dramaScore}%)`;
            selectSpudB.appendChild(optB);
        });

        // Set default A to top 1, B to top 2
        if (state.detectedSpuds.length > 1) {
            selectSpudA.selectedIndex = 0;
            selectSpudB.selectedIndex = 1;
        }

        updateCourtFighters();
    }

    function updateCourtFighters() {
        const spudA = state.detectedSpuds.find(s => s.id === selectSpudA.value);
        const spudB = state.detectedSpuds.find(s => s.id === selectSpudB.value);

        if (spudA) {
            fighterACard.innerHTML = `
                <h4 style="color:var(--neon-amber); font-family:var(--font-mono);">${spudA.id}: ${spudA.persona}</h4>
                <p style="font-size:1.4rem; font-family:var(--font-heading); color:#fff; margin:6px 0;">DRAMA: ${spudA.dramaScore}%</p>
                <p style="font-size:0.8rem; color:#94a3b8; font-style:italic;">"${spudA.quote}"</p>
            `;
        }
        if (spudB) {
            fighterBCard.innerHTML = `
                <h4 style="color:var(--glowing-cyan); font-family:var(--font-mono);">${spudB.id}: ${spudB.persona}</h4>
                <p style="font-size:1.4rem; font-family:var(--font-heading); color:#fff; margin:6px 0;">DRAMA: ${spudB.dramaScore}%</p>
                <p style="font-size:0.8rem; color:#94a3b8; font-style:italic;">"${spudB.quote}"</p>
            `;
        }

        verdictBox.classList.add('hidden');
    }

    function runCourtTrial() {
        const spudA = state.detectedSpuds.find(s => s.id === selectSpudA.value);
        const spudB = state.detectedSpuds.find(s => s.id === selectSpudB.value);

        if (!spudA || !spudB) return;

        verdictBox.classList.remove('hidden');

        if (spudA.id === spudB.id) {
            verdictWinnerText.textContent = `${spudA.id} DEFEATS ITSELF IN EXISTENTIAL PARADOX`;
            verdictReason.textContent = `"The Tribunal finds that pitting a spud against its own reflection doubles its emotional trauma instantly."`;
            return;
        }

        const winner = spudA.dramaScore >= spudB.dramaScore ? spudA : spudB;
        const loser = spudA.dramaScore < spudB.dramaScore ? spudA : spudB;
        const diff = (winner.dramaScore - loser.dramaScore).toFixed(1);

        verdictWinnerText.textContent = `${winner.id} ("${winner.persona}") WINS THE TRIAL!`;
        verdictReason.textContent = `"The Root Vegetable Tribunal declares ${winner.id} superior in emotional distress (+${diff}% higher Drama Score). ${winner.id} exhibits severe laplacian contour trauma compared to ${loser.id}."`;
    }

    // --- AMBIENT CANVAS MESH GRADIENT & SHIFT ---
    function initAmbientBackground() {
        const canvas = document.getElementById('ambientCanvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let t = 0;
        function animate() {
            t += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const x1 = canvas.width * (0.3 + 0.2 * Math.sin(t));
            const y1 = canvas.height * (0.3 + 0.2 * Math.cos(t * 0.7));
            const x2 = canvas.width * (0.7 + 0.2 * Math.cos(t * 0.8));
            const y2 = canvas.height * (0.6 + 0.2 * Math.sin(t * 0.5));

            // Glowing Amber Orb
            const grad1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, 400);
            grad1.addColorStop(0, 'rgba(255, 157, 0, 0.06)');
            grad1.addColorStop(1, 'transparent');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Glowing Cyan Orb
            const grad2 = ctx.createRadialGradient(x2, y2, 10, x2, y2, 450);
            grad2.addColorStop(0, 'rgba(0, 240, 255, 0.04)');
            grad2.addColorStop(1, 'transparent');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(animate);
        }
        animate();
    }
});
