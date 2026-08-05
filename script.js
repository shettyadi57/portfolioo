/**
 * ADITHYA S SHETTY — ULTRA PREMIUM 3D TECHNICIAN PORTFOLIO ENGINE
 * Three.js 3D Scene · Web Audio SFX · Cursor Trail · Typewriter · Scroll Reveals
 */

'use strict';

/* ══════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════ */
(function initLoader() {
    const loader = document.getElementById('loader');
    const bar    = document.getElementById('loader-bar');
    const status = document.getElementById('loader-status');

    const steps = [
        { p: 25, t: 'LOADING 3D WEBGL SHADERS...' },
        { p: 50, t: 'BUILDING NEURAL PARTICLE FIELD...' },
        { p: 75, t: 'MOUNTING HOLOGRAPHIC UI LAYER...' },
        { p: 100, t: 'SYSTEM ONLINE ✓' },
    ];

    let i = 0;
    const tick = setInterval(() => {
        if (i < steps.length) {
            const s = steps[i++];
            if (bar)    bar.style.width = s.p + '%';
            if (status) status.textContent = s.t;
        } else {
            clearInterval(tick);
            setTimeout(() => {
                if (loader) loader.classList.add('out');
                // Kick off post-loader features
                initReveal();
                initCounters();
                initBars();
                initTypewriter();
            }, 600);
        }
    }, 320);
})();


/* ══════════════════════════════════════════════
   2. THREE.JS 3D BACKGROUND
══════════════════════════════════════════════ */
function initThreeScene() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1200);
    camera.position.z = 85;

    /* — Starfield — */
    const starCount = 3000;
    const starGeo   = new THREE.BufferGeometry();
    const starPos   = new Float32Array(starCount * 3);
    const starClr   = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPos[i * 3]     = (Math.random() - 0.5) * 500;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 500;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 500;

        // Randomly cyan / violet / white
        const t = Math.random();
        if      (t < 0.4)  { starClr[i*3]=0;    starClr[i*3+1]=0.96; starClr[i*3+2]=1;    }
        else if (t < 0.65) { starClr[i*3]=0.74; starClr[i*3+1]=0;    starClr[i*3+2]=1;    }
        else               { starClr[i*3]=0.9;  starClr[i*3+1]=0.95; starClr[i*3+2]=1;    }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starClr, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.55,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* — Floating Wireframe Geometries — */
    const geoms = [
        { geo: new THREE.OctahedronGeometry(9, 1), pos: [40, 8, -30],  clr: 0x00f5ff, spd: [0.6, 0.9, 0.4] },
        { geo: new THREE.IcosahedronGeometry(7, 0), pos: [-50, -15, -25], clr: 0xbd00ff, spd: [0.4, 0.7, 0.6] },
        { geo: new THREE.TetrahedronGeometry(8, 0), pos: [-30, 20, -40], clr: 0x00ffa3, spd: [0.7, 0.5, 0.8] },
        { geo: new THREE.TorusGeometry(12, 2, 16, 40), pos: [50, -20, -50], clr: 0xff3e6e, spd: [0.3, 0.8, 0.5] },
        { geo: new THREE.OctahedronGeometry(5, 2), pos: [-10, 30, -60], clr: 0xffd700, spd: [0.9, 0.4, 0.7] },
    ];

    const meshes = geoms.map(({ geo, pos, clr, spd }) => {
        const mat  = new THREE.MeshBasicMaterial({ color: clr, wireframe: true, transparent: true, opacity: 0.22 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...pos);
        mesh.userData.spd = spd;
        scene.add(mesh);
        return mesh;
    });

    /* — Undulating Grid Plane — */
    const gridGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x9d4edd,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2.3;
    gridMesh.position.y = -45;
    scene.add(gridMesh);

    /* — Click Burst Particles — */
    const burstN   = 80;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstN * 3);
    const burstVel = Array.from({ length: burstN }, () => ({
        x: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 1.2,
        z: (Math.random() - 0.5) * 1.2,
    }));

    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({ color: 0xff3e6e, size: 1.4, transparent: true, opacity: 0 });
    const burst    = new THREE.Points(burstGeo, burstMat);
    scene.add(burst);

    window.addEventListener('click', e => {
        const ndcX =  (e.clientX / window.innerWidth)  * 2 - 1;
        const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
        const v    = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
        const dir  = v.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const p    = camera.position.clone().add(dir.multiplyScalar(dist));

        const arr = burstGeo.attributes.position.array;
        for (let i = 0; i < burstN; i++) {
            arr[i*3] = p.x; arr[i*3+1] = p.y; arr[i*3+2] = p.z;
        }
        burstGeo.attributes.position.needsUpdate = true;
        burstMat.opacity = 1;
    });

    /* — Mouse tracking — */
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* — Animation Loop — */
    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.008;

        // Rotate stars
        stars.rotation.y = t * 0.015;
        stars.rotation.x = t * 0.008;

        // Rotate floating meshes
        meshes.forEach(m => {
            m.rotation.x += m.userData.spd[0] * 0.007;
            m.rotation.y += m.userData.spd[1] * 0.006;
            m.rotation.z += m.userData.spd[2] * 0.005;
        });

        // Wave the grid
        const verts = gridGeo.attributes.position.array;
        for (let i = 0; i < verts.length; i += 3) {
            verts[i + 2] = Math.sin(t + verts[i] * 0.08) * 3.5 + Math.cos(t * 0.7 + verts[i + 1] * 0.06) * 2;
        }
        gridGeo.attributes.position.needsUpdate = true;

        // Burst decay
        if (burstMat.opacity > 0) {
            const arr = burstGeo.attributes.position.array;
            for (let i = 0; i < burstN; i++) {
                arr[i*3]   += burstVel[i].x;
                arr[i*3+1] += burstVel[i].y;
                arr[i*3+2] += burstVel[i].z;
            }
            burstGeo.attributes.position.needsUpdate = true;
            burstMat.opacity -= 0.022;
        }

        // Smooth camera mouse follow
        camera.position.x += (mx * 6 - camera.position.x) * 0.04;
        camera.position.y += (-my * 6 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
initThreeScene();


/* ══════════════════════════════════════════════
   3. CUSTOM CURSOR
══════════════════════════════════════════════ */
(function initCursor() {
    const ring = document.getElementById('cursor-ring');
    const dot  = document.getElementById('cursor-dot');
    let rx = -100, ry = -100, dx = -100, dy = -100;

    document.addEventListener('mousemove', e => {
        dx = e.clientX;
        dy = e.clientY;
        if (dot) {
            dot.style.left = dx + 'px';
            dot.style.top  = dy + 'px';
        }
    });

    (function animRing() {
        rx += (dx - rx) * 0.12;
        ry += (dy - ry) * 0.12;
        if (ring) {
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
        }
        requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .glass-pane, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();


/* ══════════════════════════════════════════════
   4. FPS COUNTER
══════════════════════════════════════════════ */
(function initFPS() {
    const el = document.getElementById('fps-val');
    let frames = 0, last = performance.now();
    function loop() {
        frames++;
        const now = performance.now();
        if (now - last >= 1000) {
            if (el) el.textContent = Math.round(frames * 1000 / (now - last));
            frames = 0; last = now;
        }
        requestAnimationFrame(loop);
    }
    loop();
})();


/* ══════════════════════════════════════════════
   5. WEB AUDIO SFX
══════════════════════════════════════════════ */
let audioCtx   = null;
let sfxEnabled = true;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq = 600, type = 'sine', dur = 0.06, gain = 0.04) {
    if (!sfxEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc  = audioCtx.createOscillator();
        const g    = audioCtx.createGain();
        osc.type   = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        g.gain.setValueAtTime(gain, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
}

const soundBtn  = document.getElementById('sound-btn');
const soundIcon = document.getElementById('sound-icon');

if (soundBtn) {
    soundBtn.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        soundIcon.className = sfxEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        if (sfxEnabled) playTone(880, 'sine', 0.12);
    });
}

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(620, 'sine', 0.04, 0.02));
    el.addEventListener('click', () => playTone(950, 'triangle', 0.08, 0.035));
});


/* ══════════════════════════════════════════════
   6. STICKY HEADER
══════════════════════════════════════════════ */
(function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    });
})();


/* ══════════════════════════════════════════════
   7. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════════════ */
(function initNavSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nl');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nl[href="#${e.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
})();


/* ══════════════════════════════════════════════
   8. MOBILE MENU
══════════════════════════════════════════════ */
(function initMobileMenu() {
    const burger  = document.getElementById('hamburger');
    const menu    = document.getElementById('mobile-menu');
    const close   = document.getElementById('mob-close');
    const mobLinks = document.querySelectorAll('.mob-link');

    const open  = () => menu && menu.classList.add('open');
    const shut  = () => menu && menu.classList.remove('open');

    if (burger) burger.addEventListener('click', open);
    if (close)  close.addEventListener('click', shut);
    mobLinks.forEach(l => l.addEventListener('click', shut));
})();


/* ══════════════════════════════════════════════
   9. TERMINAL
══════════════════════════════════════════════ */
(function initTerminal() {
    const modal  = document.getElementById('term-modal');
    const openB  = document.getElementById('term-btn');
    const closeB = document.getElementById('term-close-btn');
    const input  = document.getElementById('term-input');
    const body   = document.getElementById('term-body');

    if (openB)  openB.addEventListener('click',  () => { modal.classList.add('open'); input && input.focus(); });
    if (closeB) closeB.addEventListener('click', () => modal.classList.remove('open'));
    modal && modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    const cmds = {
        help:     'Commands: <span class="tc">projects · skills · bio · contact · matrix · clear · exit</span>',
        projects: '<span class="tc">01</span> Little Heart Beat — AI Pregnancy Companion PWA<br><span class="tc">02</span> ChronosAI — CCTV Forensics &amp; Semantic Search<br><span class="tc">03</span> Shivamogga Smart Seva — GovTech PWA',
        skills:   '<span class="tc">Languages:</span> Python, TypeScript, JS, HTML/CSS, SQL, C<br><span class="tc">Frameworks:</span> React 18, FastAPI, Flask, OpenCV, YOLOv8<br><span class="tc">Tools:</span> Docker, Supabase, Git, Linux',
        bio:      '<span class="tc">Adithya S Shetty</span> — 2nd Year BCA @ Kuvempu University<br>District Coding Champion · National Hackathon Runner-Up · Full-Stack &amp; AI Engineer',
        contact:  '<span class="tc">Email:</span> shettyadithyas57@gmail.com<br><span class="tc">Phone:</span> +91 8088716254<br><span class="tc">GitHub:</span> @shettyadi57',
        matrix:   '<span style="color:#00ffa3">WAKE UP, NEO... THE MATRIX HAS YOU.</span>',
    };

    function addLine(html, cls = '') {
        if (!body) return;
        const d = document.createElement('div');
        d.className = 'tl ' + cls;
        d.innerHTML = html;
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
    }

    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            const raw = input.value.trim();
            const cmd = raw.toLowerCase();
            input.value = '';
            if (!cmd) return;

            addLine(`<span class="tp">adithya@neural-node:~$</span> ${raw}`);

            if (cmd === 'clear')  { body.innerHTML = ''; return; }
            if (cmd === 'exit')   { modal.classList.remove('open'); return; }
            if (cmds[cmd])        addLine(cmds[cmd]);
            else addLine(`<span style="color:#ff3e6e">Command not found: '${cmd}'</span>. Type <span class="tc">help</span>.`);
        });
    }
})();


/* ══════════════════════════════════════════════
   10. 3D TILT EFFECT
══════════════════════════════════════════════ */
(function initTilt() {
    document.querySelectorAll('.tilt-el').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = e.clientX - r.left;
            const y  = e.clientY - r.top;
            const rx = -((y / r.height) - 0.5) * 16;
            const ry = ((x / r.width)  - 0.5) * 16;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        });
    });
})();


/* ══════════════════════════════════════════════
   11. SCROLL REVEAL
══════════════════════════════════════════════ */
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ══════════════════════════════════════════════
   12. NUMERICAL COUNTERS (KPI)
══════════════════════════════════════════════ */
function initCounters() {
    document.querySelectorAll('.kpi-num[data-target]').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const dec    = parseInt(el.dataset.dec || 0);
        let curr     = 0;
        const inc    = target / 60;

        function tick() {
            curr += inc;
            if (curr >= target) {
                el.textContent = target.toFixed(dec);
            } else {
                el.textContent = curr.toFixed(dec);
                requestAnimationFrame(tick);
            }
        }
        tick();
    });
}


/* ══════════════════════════════════════════════
   13. PROFICIENCY BARS
══════════════════════════════════════════════ */
function initBars() {
    const fills = document.querySelectorAll('.bar-fill[data-fill]');
    const pcts  = document.querySelectorAll('.bar-pct[data-val]');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const fill   = entry.target;
            const target = parseInt(fill.dataset.fill);
            fill.style.width = target + '%';

            // Animate percentage label
            const row = fill.closest('.bar-row');
            const pct = row ? row.querySelector('.bar-pct') : null;
            if (pct) {
                let v = 0;
                const step = setInterval(() => {
                    v++;
                    pct.textContent = v + '%';
                    if (v >= target) clearInterval(step);
                }, 12);
            }

            obs.unobserve(fill);
        });
    }, { threshold: 0.3 });

    fills.forEach(f => obs.observe(f));
}


/* ══════════════════════════════════════════════
   14. TYPEWRITER EFFECT
══════════════════════════════════════════════ */
function initTypewriter() {
    const el = document.getElementById('tw-text');
    if (!el) return;

    const phrases = [
        'Full-Stack Applications',
        'AI-Powered Platforms',
        'GovTech PWAs',
        'CCTV Forensics Engines',
        'Python & React Systems',
    ];

    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const phrase = phrases[pi];

        if (!deleting) {
            el.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) {
                deleting = true;
                setTimeout(tick, 2200);
                return;
            }
        } else {
            el.textContent = phrase.slice(0, --ci);
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
            }
        }

        setTimeout(tick, deleting ? 40 : 70);
    }
    tick();
}


/* ══════════════════════════════════════════════
   15. CONTACT FORM
══════════════════════════════════════════════ */
(function initForm() {
    const form = document.getElementById('contactForm');
    const btn  = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!btn) return;

        btn.innerHTML = '<span>TRANSMITTING...</span><i class="fas fa-satellite-dish fa-spin"></i>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>MESSAGE SENT ✓</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00ffa3, #00c47a)';
            form.reset();

            setTimeout(() => {
                btn.innerHTML = '<span>TRANSMIT MESSAGE</span><i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                btn.disabled = false;
            }, 3500);
        }, 1800);
    });
})();


/* ══════════════════════════════════════════════
   16. SMOOTH ANCHOR SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
