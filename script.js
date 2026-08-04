/**
 * ADITHYA S SHETTY — 8K 3D WEBGL CYBER PORTFOLIO ENGINE
 * Technologies: Three.js 3D Engine, Web Audio API Synth, Interactive Hacker CLI, 3D Tilt
 */

'use strict';

/* ══════════════════════════════════════════════
   1. LOADER & INITIALIZATION
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderStatus = document.getElementById('loader-status');

    const loadingSteps = [
        { pct: 30, text: 'LOADING 3D WEBGL SHADERS...' },
        { pct: 60, text: 'SYNTHESIZING SFX AUDIO ENGINE...' },
        { pct: 90, text: 'MOUNTING HACKER CLI TERMINAL...' },
        { pct: 100, text: 'SYSTEM ONLINE // READY' }
    ];

    let stepIdx = 0;
    const loadInterval = setInterval(() => {
        if (stepIdx < loadingSteps.length) {
            const step = loadingSteps[stepIdx];
            if (loaderBar) loaderBar.style.width = `${step.pct}%`;
            if (loaderStatus) loaderStatus.textContent = step.text;
            stepIdx++;
        } else {
            clearInterval(loadInterval);
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                initMeterObserver();
                initCounters();
            }, 500);
        }
    }, 250);
});

/* ══════════════════════════════════════════════
   2. WEB AUDIO SFX SYNTHESIZER
══════════════════════════════════════════════ */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSynthTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio context fallback
    }
}

// Sound FX bindings
const soundToggleBtn = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundIcon) {
            soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
        if (soundEnabled) playSynthTone(880, 'sine', 0.1);
    });
}

// Bind SFX to buttons & links
document.querySelectorAll('button, a, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => playSynthTone(600, 'sine', 0.04, 0.02));
    el.addEventListener('click', () => playSynthTone(900, 'triangle', 0.08, 0.04));
});

/* ══════════════════════════════════════════════
   3. CUSTOM CURSOR & FPS COUNTER
══════════════════════════════════════════════ */
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

let mouseX = -100, mouseY = -100;
let outlineX = -100, outlineY = -100;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// FPS Counter
let frameCount = 0;
let lastTime = performance.now();
const fpsCounter = document.getElementById('fps-counter');

function updateFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        if (fpsCounter) fpsCounter.textContent = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
    }
    requestAnimationFrame(updateFPS);
}
updateFPS();

/* ══════════════════════════════════════════════
   4. THREE.JS 3D WEBGL SCENE
══════════════════════════════════════════════ */
function initThreeWebGL() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 70;

    // ── Layer 1: 3D Starfield Particles ──
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 350;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 350;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 350;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starMat = new THREE.PointsMaterial({
        color: 0x00f3ff,
        size: 0.6,
        transparent: true,
        opacity: 0.7,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Layer 2: Undulating 3D Cyber Mesh ──
    const meshGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
    const meshMat = new THREE.MeshBasicMaterial({
        color: 0x9d4edd,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const cyberMesh = new THREE.Mesh(meshGeo, meshMat);
    cyberMesh.rotation.x = -Math.PI / 2.5;
    cyberMesh.position.y = -35;
    scene.add(cyberMesh);

    // ── Layer 3: Interactive Metallic Crystal ──
    const crystalGeo = new THREE.OctahedronGeometry(10, 2);
    const crystalMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(45, 10, -20);
    scene.add(crystal);

    // ── Layer 4: Interactive Click Particle Burst ──
    const burstCount = 60;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVels = [];

    for (let i = 0; i < burstCount; i++) {
        burstPos[i * 3] = 0;
        burstPos[i * 3 + 1] = 0;
        burstPos[i * 3 + 2] = 0;
        burstVels.push({
            x: (Math.random() - 0.5) * 0.8,
            y: (Math.random() - 0.5) * 0.8,
            z: (Math.random() - 0.5) * 0.8,
        });
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({
        color: 0xff007f,
        size: 1.2,
        transparent: true,
        opacity: 0,
    });
    const burstParticles = new THREE.Points(burstGeo, burstMat);
    scene.add(burstParticles);

    // Click to Trigger Burst
    window.addEventListener('click', (e) => {
        const mouseVec = new THREE.Vector3(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        mouseVec.unproject(camera);
        const dir = mouseVec.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        const positions = burstGeo.attributes.position.array;
        for (let i = 0; i < burstCount; i++) {
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;
        }
        burstGeo.attributes.position.needsUpdate = true;
        burstMat.opacity = 1.0;
    });

    // Mouse Interaction
    let normMouseX = 0, normMouseY = 0;
    window.addEventListener('mousemove', (e) => {
        normMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        normMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation Loop
    let clock = 0;
    function animate3D() {
        requestAnimationFrame(animate3D);
        clock += 0.01;

        // Rotate starfield
        starField.rotation.y = clock * 0.02;
        starField.rotation.x = clock * 0.01;

        // Wave mesh movement
        const vertices = meshGeo.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.sin(clock + vertices[i] * 0.1) * 3;
        }
        meshGeo.attributes.position.needsUpdate = true;

        // Rotate crystal
        crystal.rotation.x = clock * 0.5;
        crystal.rotation.y = clock * 0.8;

        // Update Click Burst
        if (burstMat.opacity > 0) {
            const bPos = burstGeo.attributes.position.array;
            for (let i = 0; i < burstCount; i++) {
                bPos[i * 3] += burstVels[i].x;
                bPos[i * 3 + 1] += burstVels[i].y;
                bPos[i * 3 + 2] += burstVels[i].z;
            }
            burstGeo.attributes.position.needsUpdate = true;
            burstMat.opacity -= 0.025;
        }

        // Camera follow mouse
        camera.position.x += (normMouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-normMouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate3D();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
initThreeWebGL();

/* ══════════════════════════════════════════════
   5. HACKER CLI TERMINAL MODAL LOGIC
══════════════════════════════════════════════ */
const terminalModal = document.getElementById('terminal-modal');
const terminalToggle = document.getElementById('terminal-toggle');
const termClose = document.getElementById('term-close');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

if (terminalToggle) {
    terminalToggle.addEventListener('click', () => {
        terminalModal.classList.add('open');
        if (terminalInput) terminalInput.focus();
    });
}

if (termClose) {
    termClose.addEventListener('click', () => {
        terminalModal.classList.remove('open');
    });
}

const commands = {
    help: 'Available commands: projects, skills, bio, contact, matrix, clear, exit',
    projects: '1. Little Heart Beat (AI Pregnancy Companion)\n2. ChronosAI (CCTV Forensics Platform)\n3. Shivamogga Smart Seva (GovTech PWA)',
    skills: 'Languages: Python, TypeScript, JS, HTML/CSS, SQL, C\nFrameworks: React 18, FastAPI, Flask, OpenCV, YOLOv8\nTools: Docker, Supabase, Git, Linux',
    bio: 'Adithya S Shetty — 2nd Year BCA Student @ Kuvempu University. District Coding Champion & Full-Stack Engineer.',
    contact: 'Email: shettyadithyas57@gmail.com | Phone: +91 8088716254 | GitHub: @shettyadi57',
    matrix: 'WAKE UP, NEO... THE MATRIX HAS YOU.',
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            const inputLine = document.createElement('div');
            inputLine.className = 'term-line';
            inputLine.innerHTML = `<span class="term-prompt">adithya@cyber-node:~$</span> ${cmd}`;
            terminalBody.appendChild(inputLine);

            const responseLine = document.createElement('div');
            responseLine.className = 'term-line';

            if (cmd === 'clear') {
                terminalBody.innerHTML = '';
                return;
            } else if (cmd === 'exit') {
                terminalModal.classList.remove('open');
                return;
            } else if (commands[cmd]) {
                responseLine.textContent = commands[cmd];
            } else if (cmd !== '') {
                responseLine.textContent = `Command not recognized: '${cmd}'. Type 'help' for options.`;
            }

            if (cmd !== '') terminalBody.appendChild(responseLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

/* ══════════════════════════════════════════════
   6. 3D TILT EFFECT ON CARDS
══════════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotX = -((y - cy) / cy) * 10;
        const rotY = ((x - cx) / cx) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

/* ══════════════════════════════════════════════
   7. SKILL METERS & NUMERICAL COUNTERS
══════════════════════════════════════════════ */
function initMeterObserver() {
    const fills = document.querySelectorAll('.meter-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = fill.dataset.fill;

                const pctElem = fill.closest('.meter-item').querySelector('.meter-pct');
                if (pctElem) {
                    let val = 0;
                    const target = parseInt(pctElem.dataset.value);
                    const interval = setInterval(() => {
                        val++;
                        pctElem.textContent = `${val}%`;
                        if (val >= target) clearInterval(interval);
                    }, 15);
                }
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(f => observer.observe(f));
}

function initCounters() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const decimals = parseInt(stat.dataset.decimals || 0);
        let curr = 0;
        const inc = target / 50;

        const step = () => {
            curr += inc;
            if (curr >= target) {
                stat.textContent = target.toFixed(decimals);
            } else {
                stat.textContent = curr.toFixed(decimals);
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    });
}

/* ══════════════════════════════════════════════
   8. MOBILE MENU & STICKY HEADER
══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const header = document.getElementById('header');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
}
if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
}

window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
});
