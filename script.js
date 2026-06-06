/* ═══════════════════════════════════════════════════════════════════════
   HIMALSHA JAYAMAL RATHNAYAKA — PORTFOLIO JS
   Version 3.0 — Full Production Build
   
   Modules:
   1.  Loading Screen
   2.  Custom Cursor
   3.  Particle / Starfield Canvas
   4.  Typed Role Animation
   5.  Nav Scroll Behaviour & Active Link
   6.  Hamburger / Mobile Drawer
   7.  Scroll Reveal (IntersectionObserver)
   8.  Animated Counter (Quick Stats)
   9.  Skill Bar Animations
   10. Project Filter Tabs
   11. Timeline Animated Nodes
   12. Profile Hex 3D Tilt
   13. Card Parallax Glow Follow Mouse
   14. Section Progress Indicator
   15. Easter Egg — Konami Code
═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ─────────────────────────────────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader     = $('#loader');
  const bar        = $('#loader-bar');
  const statusEl   = $('#loader-status');

  const messages = [
    'Initialising systems...',
    'Loading RTL modules...',
    'Mounting starfield...',
    'Spinning up FPGA cores...',
    'Running verification suite...',
    'Portfolio ready.',
  ];

  let progress = 0;
  let msgIdx   = 0;

  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18 + 4, 100);
    bar.style.width = progress + '%';

    const step = Math.floor((progress / 100) * messages.length);
    if (step !== msgIdx && step < messages.length) {
      msgIdx = step;
      statusEl.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startAnimations();
      }, 380);
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ─────────────────────────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursor-follower');

  if (!cursor || !follower) return;

  let mx = -100, my = -100;
  let fx =  -100, fy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function followTick() {
    fx = lerp(fx, mx, 0.14);
    fy = lerp(fy, my, 0.14);
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followTick);
  })();

  // Hover states
  const hoverEls = 'a, button, .cta-btn, .proj-card, .filter-btn, .domain-item, .chip, .tech-pill, .skill-cat-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

/* ─────────────────────────────────────────────────────────────────────
   3. PARTICLE / STARFIELD CANVAS
───────────────────────────────────────────────────────────────────── */
(function initStarfield() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let stars = [], nebulae = [], shootingStars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildScene();
  }

  function buildScene() {
    const count = Math.floor((W * H) / 6500);
    stars = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.3 + 0.1,
      speed: Math.random() * 0.18 + 0.03,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.015 + 0.003,
      baseAlpha: Math.random() * 0.55 + 0.1,
      hue:   Math.random() > 0.92 ? 190 : 210,
    }));

    nebulae = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 200 + 80,
      alpha: Math.random() * 0.04 + 0.01,
      color: Math.random() > 0.5
        ? 'rgba(0,212,255,' : 'rgba(100,0,255,',
    }));
  }

  // Shooting star spawner
  function spawnShootingStar() {
    if (Math.random() > 0.003) return;
    shootingStars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.6,
      len:   Math.random() * 140 + 60,
      speed: Math.random() * 7 + 5,
      angle: Math.PI / 6 + (Math.random() - 0.5) * 0.3,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02,
    });
  }

  let tick = 0;
  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    tick += 0.008;

    // Nebulae
    nebulae.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color + n.alpha + ')');
      grad.addColorStop(1, n.color + '0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars with parallax
    const px = (mouseX - W / 2) / W;
    const py = (mouseY - H / 2) / H;

    stars.forEach(s => {
      s.phase += s.phaseSpeed;
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      const ox = px * s.r * 18;
      const oy = py * s.r * 18;

      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 80%, 90%, ${alpha})`;
      ctx.fill();

      // Cross sparkle for big stars
      if (s.r > 1.1 && Math.sin(s.phase) > 0.7) {
        ctx.strokeStyle = `hsla(${s.hue}, 90%, 95%, ${alpha * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x + ox - s.r * 3, s.y + oy);
        ctx.lineTo(s.x + ox + s.r * 3, s.y + oy);
        ctx.moveTo(s.x + ox, s.y + oy - s.r * 3);
        ctx.lineTo(s.x + ox, s.y + oy + s.r * 3);
        ctx.stroke();
      }
    });

    // Shooting stars
    spawnShootingStar();
    shootingStars = shootingStars.filter(ss => ss.alpha > 0);
    shootingStars.forEach(ss => {
      const ex = ss.x + Math.cos(ss.angle) * ss.len;
      const ey = ss.y + Math.sin(ss.angle) * ss.len;
      const grad = ctx.createLinearGradient(ss.x, ss.y, ex, ey);
      grad.addColorStop(0, `rgba(0,212,255,0)`);
      grad.addColorStop(0.4, `rgba(0,212,255,${ss.alpha * 0.8})`);
      grad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= ss.decay;
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

/* ─────────────────────────────────────────────────────────────────────
   4. TYPED ROLE ANIMATION
───────────────────────────────────────────────────────────────────── */
(function initTyped() {
  const el = $('#typed-role');
  if (!el) return;

  const words = [
    'Computer Architect',
    'RTL Designer',
    'FPGA Developer',
    'Robotics Engineer',
    'AI Researcher',
    'Verification Engineer',
    'Embedded Systems Dev',
    'Future Innovator',
  ];

  let wIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const w = words[wIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = w.slice(0, cIdx);
      if (cIdx === w.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 60 + Math.random() * 30);
    } else {
      cIdx--;
      el.textContent = w.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 28 + Math.random() * 18);
    }
  }

  setTimeout(tick, 1800);
})();

/* ─────────────────────────────────────────────────────────────────────
   5. NAV SCROLL & ACTIVE LINK
───────────────────────────────────────────────────────────────────── */
(function initNav() {
  const nav = $('#navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active section highlight
  const sections = $$('section[id]');
  const links    = $$('.nav-links a[data-section]');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = links.find(l => l.dataset.section === e.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sectionObs.observe(s));
})();

/* ─────────────────────────────────────────────────────────────────────
   6. HAMBURGER / MOBILE DRAWER
───────────────────────────────────────────────────────────────────── */
(function initHamburger() {
  const btn    = $('#hamburger');
  const drawer = $('#mobile-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    drawer.classList.toggle('open', open);
  });

  $$('.drawer-link').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      drawer.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      btn.classList.remove('open');
      drawer.classList.remove('open');
    }
  });
})();

/* ─────────────────────────────────────────────────────────────────────
   7. SCROLL REVEAL
───────────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal-up, .reveal-left, .reveal-right');

  // Stagger delays for children of grids
  $$('.projects-masonry .proj-card, .skills-categories .skill-cat-card, .domain-grid .domain-item, .chip-grid .chip').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-left')) {
      el.classList.add('reveal-up');
    }
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────────────
   8. ANIMATED COUNTERS
───────────────────────────────────────────────────────────────────── */
function initCounters() {
  const nums = $$('.qs-num[data-target]');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1600;
      const start  = performance.now();

      function step(now) {
        const t = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────────────────────────────
   9. SKILL BAR ANIMATIONS
───────────────────────────────────────────────────────────────────── */
function initSkillBars() {
  const fills = $$('.sb-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      const pct  = fill.dataset.pct || 0;
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, 100);
      obs.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => obs.observe(f));
}

/* ─────────────────────────────────────────────────────────────────────
   10. PROJECT FILTER TABS
───────────────────────────────────────────────────────────────────── */
function initFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.proj-card[data-cat]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.cat !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────
   11. TIMELINE NODE GLOW ON SCROLL
───────────────────────────────────────────────────────────────────── */
function initTimeline() {
  const nodes = $$('.tl-node');
  const items = $$('.tl-item');

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    obs.observe(item);
  });
}

/* ─────────────────────────────────────────────────────────────────────
   12. PROFILE HEX 3D TILT
───────────────────────────────────────────────────────────────────── */
function initProfileTilt() {
  const wrap = $('#profile-wrap');
  if (!wrap) return;

  let isHovering = false;
  let rx = 0, ry = 0, trx = 0, try_ = 0;

  wrap.addEventListener('mouseenter', () => { isHovering = true; });
  wrap.addEventListener('mouseleave', () => {
    isHovering = false;
    trx = 0; try_ = 0;
  });

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    trx  = ((e.clientY - cy) / (rect.height / 2)) * 14;
    try_ = -((e.clientX - cx) / (rect.width  / 2)) * 14;
  });

  (function tiltTick() {
    rx = lerp(rx, trx,  0.1);
    ry = lerp(ry, try_, 0.1);
    wrap.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(tiltTick);
  })();
}

/* ─────────────────────────────────────────────────────────────────────
   13. PANEL GLOW FOLLOW MOUSE
───────────────────────────────────────────────────────────────────── */
function initGlowFollow() {
  $$('.glass-panel, .proj-card').forEach(panel => {
    panel.addEventListener('mousemove', e => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = panel.querySelector('.panel-glow, .proj-glow');
      if (glow) {
        glow.style.left = (x - 140) + 'px';
        glow.style.top  = (y - 140) + 'px';
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────
   14. SECTION PROGRESS INDICATOR (thin line across top)
───────────────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 900;
    background: linear-gradient(90deg, #00d4ff, #00ffaa);
    box-shadow: 0 0 10px rgba(0,212,255,0.6);
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = clamp(pct, 0, 100) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────────────
   15. EASTER EGG — KONAMI CODE
───────────────────────────────────────────────────────────────────── */
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        triggerMatrixRain();
      }
    } else {
      idx = 0;
    }
  });

  function triggerMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `position:fixed;inset:0;z-index:8999;pointer-events:none;`;
    document.body.appendChild(canvas);
    const ctx  = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols  = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01100110RTLFPGASystemVerilog';

    let frames = 0;
    function draw() {
      ctx.fillStyle = 'rgba(2,8,16,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '14px JetBrains Mono, monospace';

      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });

      frames++;
      if (frames < 200) requestAnimationFrame(draw);
      else canvas.remove();
    }
    draw();
  }
})();

/* ─────────────────────────────────────────────────────────────────────
   16. TERMINAL CARD TYPEWRITER LOOP
───────────────────────────────────────────────────────────────────── */
function initTerminalBlink() {
  const blink = $('.t-blink');
  if (!blink) return;
  // Already handled by CSS animation — just make the cursor cmd cycle
  const cmds = [
    'ready --for-opportunities',
    'designing --processors',
    'verifying --rtl-design',
    'building --slam-robots',
    'optimising --cache-policy',
  ];
  const cmdEl = blink.querySelector('.t-cmd');
  if (!cmdEl) return;
  let ci = 0;
  setInterval(() => {
    ci = (ci + 1) % cmds.length;
    cmdEl.style.opacity = '0';
    setTimeout(() => {
      cmdEl.textContent = cmds[ci];
      cmdEl.style.opacity = '1';
    }, 200);
  }, 2800);
}

/* ─────────────────────────────────────────────────────────────────────
   17. FLOATING PARTICLE CONNECTIONS (subtle, on hover of hero)
───────────────────────────────────────────────────────────────────── */
function initHeroOrbitPulse() {
  const orbit1 = $('.orbit-1');
  const orbit2 = $('.orbit-2');
  if (!orbit1 || !orbit2) return;

  // The CSS animation handles spinning, but let's add subtle speed variation
  let speed1 = 22, speed2 = 40;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const factor = 1 + (dist / window.innerWidth) * 0.4;
    orbit1.style.animationDuration = (speed1 / factor) + 's';
    orbit2.style.animationDuration = (speed2 / factor) + 's';
  });
}

/* ─────────────────────────────────────────────────────────────────────
   18. TAG CLOUD INTERACTION (subtle floating)
───────────────────────────────────────────────────────────────────── */
function initTagCloud() {
  $$('.tc-tag').forEach((tag, i) => {
    const phase = i * 0.7;
    const amp   = 2 + Math.random() * 2;
    let t = 0;
    function float() {
      t += 0.015;
      tag.style.transform = `translateY(${Math.sin(t + phase) * amp}px)`;
      requestAnimationFrame(float);
    }
    setTimeout(float, i * 80);
  });
}

/* ─────────────────────────────────────────────────────────────────────
   19. SMOOTH ANCHOR SCROLL
───────────────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────
   20. SECTION ENTRANCE — GRID ITEMS STAGGER
───────────────────────────────────────────────────────────────────── */
function initGridStagger() {
  const grids = [
    '.domain-grid',
    '.chip-grid',
    '.skills-categories',
    '.approach-grid',
    '.sensor-chips',
  ];

  grids.forEach(sel => {
    const grid = $(sel);
    if (!grid) return;
    const children = [...grid.children];
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.06}s`;
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────
   21. BACK-TO-TOP BUTTON
───────────────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 500;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3);
    color: #00d4ff; font-size: 1.1rem; font-family: monospace;
    cursor: none; display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s, background 0.2s;
    backdrop-filter: blur(8px);
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'rgba(0,212,255,0.2)';
    document.body.classList.add('cursor-hover');
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'rgba(0,212,255,0.1)';
    document.body.classList.remove('cursor-hover');
  });
}

/* ─────────────────────────────────────────────────────────────────────
   22. GLITCH TEXT EFFECT ON LOGO (occasional)
───────────────────────────────────────────────────────────────────── */
function initLogoGlitch() {
  const logo = $('.logo-text');
  if (!logo) return;
  const orig = logo.textContent;
  const glitchChars = 'HJR#@!01XZ▓';

  setInterval(() => {
    if (Math.random() > 0.93) {
      let i = 0;
      const scramble = setInterval(() => {
        logo.textContent = orig.split('').map((c, j) =>
          Math.random() > 0.6 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c
        ).join('');
        i++;
        if (i > 4) {
          clearInterval(scramble);
          logo.textContent = orig;
        }
      }, 60);
    }
  }, 4000);
}

/* ─────────────────────────────────────────────────────────────────────
   START — called after loader finishes
───────────────────────────────────────────────────────────────────── */
function startAnimations() {
  initScrollReveal();
  initCounters();
  initSkillBars();
  initFilter();
  initTimeline();
  initProfileTilt();
  initGlowFollow();
  initScrollProgress();
  initTerminalBlink();
  initHeroOrbitPulse();
  initTagCloud();
  initSmoothScroll();
  initGridStagger();
  initBackToTop();
  initLogoGlitch();
}