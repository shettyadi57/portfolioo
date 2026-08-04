/**
 * ADITHYA S SHETTY — PREMIUM PORTFOLIO SCRIPT
 * Features: Three.js 3D Particles, Custom Cursor, Tilt Cards,
 *           Smooth Scroll, Reveal Animations, Proficiency Bars
 */

'use strict';

/* ══════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════ */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealObserver();
    }, 1200);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* ══════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════ */
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

let cursorX = -100, cursorY = -100;
let outlineX = -100, outlineY = -100;
let animFrame;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
});

function animateCursor() {
    outlineX += (cursorX - outlineX) * 0.12;
    outlineY += (cursorY - outlineY) * 0.12;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    animFrame = requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});


/* ══════════════════════════════════════════════
   3. THREE.JS 3D PARTICLE BACKGROUND
══════════════════════════════════════════════ */
function initThreeBackground() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    // ── Particle System 1: Stars ──
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3]     = (Math.random() - 0.5) * 400;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        starSizes[i] = Math.random() * 1.5 + 0.3;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
        color: 0xaad4ff,
        size: 0.5,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Particle System 2: Neon floating nodes ──
    const nodeCount = 200;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodeCount; i++) {
        nodePositions[i * 3]     = (Math.random() - 0.5) * 160;
        nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
        nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
        nodeVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.01,
        });
    }

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 1.0,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
    });

    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // ── Connection Lines ──
    const linePositions = [];
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.04,
    });

    // Create a few static connections
    for (let i = 0; i < 30; i++) {
        const i1 = Math.floor(Math.random() * nodeCount);
        const i2 = Math.floor(Math.random() * nodeCount);
        const geoLine = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(
                nodePositions[i1 * 3],
                nodePositions[i1 * 3 + 1],
                nodePositions[i1 * 3 + 2]
            ),
            new THREE.Vector3(
                nodePositions[i2 * 3],
                nodePositions[i2 * 3 + 1],
                nodePositions[i2 * 3 + 2]
            )
        ]);
        scene.add(new THREE.Line(geoLine, lineMat));
    }

    // ── Floating Geometric Shape ──
    const icosaGeo = new THREE.IcosahedronGeometry(12, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.04,
    });
    const icosa = new THREE.Mesh(icosaGeo, icosaMat);
    icosa.position.set(60, -20, -40);
    scene.add(icosa);

    const torus2Geo = new THREE.TorusGeometry(20, 0.5, 8, 60);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.06,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torusMat);
    torus2.position.set(-60, 30, -60);
    scene.add(torus2);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // ── Animation Loop ──
    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.005;

        // Rotate star field
        stars.rotation.y = t * 0.03;
        stars.rotation.x = t * 0.01;

        // Animate nodes
        const pos = nodeGeo.attributes.position.array;
        for (let i = 0; i < nodeCount; i++) {
            pos[i * 3]     += nodeVelocities[i].x;
            pos[i * 3 + 1] += nodeVelocities[i].y;
            pos[i * 3 + 2] += nodeVelocities[i].z;

            // Boundary wrap
            if (Math.abs(pos[i * 3])     > 80) nodeVelocities[i].x *= -1;
            if (Math.abs(pos[i * 3 + 1]) > 80) nodeVelocities[i].y *= -1;
            if (Math.abs(pos[i * 3 + 2]) > 40) nodeVelocities[i].z *= -1;
        }
        nodeGeo.attributes.position.needsUpdate = true;

        // Rotate geometries
        icosa.rotation.x = t * 0.5;
        icosa.rotation.y = t * 0.3;
        torus2.rotation.x = t * 0.2;
        torus2.rotation.z = t * 0.1;

        // Smooth camera follow mouse
        camera.position.x += (mouseX * 8 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 8 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Scroll parallax
        scene.position.y = scrollY * 0.03;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

initThreeBackground();


/* ══════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
══════════════════════════════════════════════ */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = `${pct}%`;
});


/* ══════════════════════════════════════════════
   5. STICKY HEADER
══════════════════════════════════════════════ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
});


/* ══════════════════════════════════════════════
   6. MOBILE MENU
══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});


/* ══════════════════════════════════════════════
   7. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === id);
            });
        }
    });
}, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ══════════════════════════════════════════════
   8. SMOOTH SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});


/* ══════════════════════════════════════════════
   9. SCROLL REVEAL ANIMATIONS
══════════════════════════════════════════════ */
function initRevealObserver() {
    // Add reveal classes dynamically
    const revealTargets = [
        { selector: '.section-header', cls: 'reveal' },
        { selector: '.glass-card', cls: 'reveal' },
        { selector: '.timeline-item', cls: 'reveal-left' },
        { selector: '.about-visual-col', cls: 'reveal-right' },
        { selector: '.hero-content', cls: 'reveal-left' },
        { selector: '.hero-visual', cls: 'reveal-right' },
    ];

    revealTargets.forEach(({ selector, cls }) => {
        document.querySelectorAll(selector).forEach((el, idx) => {
            el.classList.add(cls);
            el.style.transitionDelay = `${idx * 0.08}s`;
        });
    });

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '-40px 0px 0px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObs.observe(el);
    });
}


/* ══════════════════════════════════════════════
   10. PROFICIENCY BARS ANIMATION
══════════════════════════════════════════════ */
const profFills = document.querySelectorAll('.prof-fill');

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.dataset.width;
            fill.style.width = `${width}%`;
            barObserver.unobserve(fill);
        }
    });
}, { threshold: 0.5 });

profFills.forEach(fill => barObserver.observe(fill));


/* ══════════════════════════════════════════════
   11. 3D TILT EFFECT ON CARDS
══════════════════════════════════════════════ */
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx;
            const dy = (y - cy) / cy;

            const rotX = -dy * 10;
            const rotY = dx * 10;

            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;

            // Update shine position
            const shine = card.querySelector('.project-shine');
            if (shine) {
                shine.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
                shine.style.setProperty('--my', `${(y / rect.height) * 100}%`);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });
}

initTiltCards();


/* ══════════════════════════════════════════════
   12. CONTACT FORM
══════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) return;

    // Loading state
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        contactForm.reset();

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }, 1500);
});


/* ══════════════════════════════════════════════
   13. TYPING CURSOR EFFECT (Hero Section)
══════════════════════════════════════════════ */
function initParticleCounter() {
    // Add a subtle particle count to console for fun
    console.log(
        '%c👨‍💻 Adithya S Shetty Portfolio\n%c Built with Three.js + Vanilla JS\n%c github.com/shettyadi57',
        'color: #00d4ff; font-size: 20px; font-weight: bold;',
        'color: #a855f7; font-size: 14px;',
        'color: #94a3b8; font-size: 12px;'
    );
}

initParticleCounter();


/* ══════════════════════════════════════════════
   14. ORBIT ICON ANIMATION FIX
══════════════════════════════════════════════ */
function fixOrbitIcons() {
    // Counter-rotate orbit icons so they stay upright
    const orbits = document.querySelectorAll('.orbit');
    const speeds = [12, 20]; // seconds
    
    orbits.forEach((orbit, oi) => {
        const icons = orbit.querySelectorAll('.orbit-icon');
        const speed = speeds[oi] || 15;
        const dir = oi % 2 === 0 ? 1 : -1;

        let angle = 0;
        setInterval(() => {
            angle += (360 / (speed * 60)) * dir;
            icons.forEach((icon, ii) => {
                const baseAngle = (360 / icons.length) * ii;
                const r = oi === 0 ? 100 : 160;
                const rad = ((baseAngle + angle) * Math.PI) / 180;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                icon.style.transform = `translate(${x}px, ${y}px)`;
                icon.style.position = 'absolute';
                icon.style.top = '50%';
                icon.style.left = '50%';
                icon.style.marginTop = '-22px';
                icon.style.marginLeft = '-22px';
            });
        }, 1000 / 60);
    });
}

// Run orbit fix only on desktop
if (window.innerWidth > 768) {
    fixOrbitIcons();
}


/* ══════════════════════════════════════════════
   15. HERO NUMBER COUNTER ANIMATION
══════════════════════════════════════════════ */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent.replace('+', ''));
        const suffix = counter.textContent.includes('+') ? '+' : '';
        const decimals = counter.textContent.includes('.') ? 2 : 0;
        let current = 0;
        const increment = target / 60;

        const step = () => {
            current = Math.min(current + increment, target);
            counter.textContent = current.toFixed(decimals) + suffix;
            if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

// Run once hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        setTimeout(animateCounters, 1400); // after loader
        heroObserver.disconnect();
    }
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);


/* ══════════════════════════════════════════════
   16. ACTIVE NAV INDICATOR
══════════════════════════════════════════════ */
// Ensure first link is active on load
document.addEventListener('DOMContentLoaded', () => {
    const firstLink = document.querySelector('.nav-link[data-section="home"]');
    if (firstLink) firstLink.classList.add('active');
});
