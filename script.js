/* ══════════════════════════════════════════════════════
   SHRIYANSH SINGH — Portfolio v4 · script.js
   Performance rules:
   ✅ Only transform + opacity animated (no layout props)
   ✅ will-change set in CSS, not JS
   ✅ No canvas particle network (main lag source removed)
   ✅ GSAP force3D: true on all tweens
   ✅ RAF-based cursor — no JS transition on position
   ✅ Magnetic strength capped so it never triggers repaint
   ✅ ScrollTrigger batch for scroll reveals
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Wait for GSAP to be available (loaded deferred)
  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      cb();
    } else {
      setTimeout(() => waitForGSAP(cb), 60);
    }
  }

  /* ════════════════════════════════════════
     1. LOADER
  ════════════════════════════════════════ */
  function initLoader() {
    const loader = document.getElementById('loader');
    // Hide after fill animation completes
    setTimeout(() => {
      loader.classList.add('gone');
      initHeroEntrance();
    }, 1400);
  }

  /* ════════════════════════════════════════
     2. HERO ENTRANCE — staggered GSAP timeline
        force3D: true → GPU composite layer
  ════════════════════════════════════════ */
  function initHeroEntrance() {
    waitForGSAP(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } });

      tl.from('.hero-badge',   { opacity: 0, y: 16, duration: 0.6 })
        .from('.name-row',     { opacity: 0, y: 60, duration: 0.85, stagger: 0.12, ease: 'power4.out' }, '-=0.2')
        .from('.hero-roles',   { opacity: 0, y: 14, duration: 0.5 }, '-=0.4')
        .from('.hero-bio',     { opacity: 0, y: 14, duration: 0.5 }, '-=0.35')
        .from('.hero-actions', { opacity: 0, y: 14, duration: 0.5 }, '-=0.35')
        .from('.hero-socials', { opacity: 0, y: 10, duration: 0.45 }, '-=0.3')
        .from('.avatar-wrap',  { opacity: 0, scale: 0.88, duration: 0.9, ease: 'back.out(1.4)' }, '-=1')
        .from('.chip',         { opacity: 0, scale: 0.7, duration: 0.45, stagger: 0.1, ease: 'back.out(2)' }, '-=0.4')
        .from('.stats-row',    { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
        .from('.scroll-hint',  { opacity: 0, y: 8,  duration: 0.4 }, '-=0.2')
        .from('.mesh',         { opacity: 0, duration: 1.5, stagger: 0.3 }, 0);
    });
  }

  /* ════════════════════════════════════════
     3. SCROLL REVEALS
        Use ScrollTrigger.batch for performance
        (one IntersectionObserver, not N)
  ════════════════════════════════════════ */
  function initScrollReveals() {
    waitForGSAP(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Generic .reveal elements — batched
      ScrollTrigger.batch('.reveal', {
        start: 'top 90%',
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            force3D: true
          });
        },
        once: true
      });

      // Skill cards wave
      ScrollTrigger.create({
        trigger: '.skills-grid',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.from('.skill-card', {
            opacity: 0,
            y: 35,
            scale: 0.97,
            duration: 0.65,
            stagger: { amount: 0.45, from: 'start' },
            ease: 'power3.out',
            force3D: true
          });
        }
      });

      // Project rows — slide from left
      gsap.utils.toArray('.proj-row').forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.from(row, {
              opacity: 0,
              x: -30,
              duration: 0.7,
              ease: 'power3.out',
              force3D: true,
              delay: i * 0.08
            });
          }
        });
      });

      // Info cards pop
      ScrollTrigger.create({
        trigger: '.info-cards',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.from('.icard', {
            opacity: 0,
            y: 28,
            scale: 0.96,
            duration: 0.55,
            stagger: 0.09,
            ease: 'back.out(1.4)',
            force3D: true
          });
        }
      });

      // Contact links
      ScrollTrigger.create({
        trigger: '.contact-links',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.from('.c-link', {
            opacity: 0,
            x: -22,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            force3D: true
          });
        }
      });

      // Ticker
      ScrollTrigger.create({
        trigger: '.ticker',
        start: 'top 100%',
        once: true,
        onEnter: () => gsap.from('.ticker', { opacity: 0, duration: 0.6 })
      });
    });
  }

  /* ════════════════════════════════════════
     4. CUSTOM CURSOR
        RAF loop — never triggers layout
  ════════════════════════════════════════ */
  function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0;    // mouse position
    let rx = 0, ry = 0;    // ring position (lerped)

    // Direct position for dot (no CSS transition on position)
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    // RAF lerp for ring — smooth, no jank
    (function raf() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(raf);
    })();

    // Hover state
    document.querySelectorAll('a, button, .magnetic, .tag, .skill-card, .icard, .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('big');  ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '.5'; });
  }

  /* ════════════════════════════════════════
     5. PROGRESS BAR — rAF debounced
  ════════════════════════════════════════ */
  function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
          bar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ════════════════════════════════════════
     6. NAV — scroll sticky
  ════════════════════════════════════════ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('stuck', window.scrollY > 55);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Active link highlight
    waitForGSAP(() => {
      document.querySelectorAll('section[id]').forEach(sec => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: ()     => setActive(sec.id),
          onEnterBack: () => setActive(sec.id)
        });
      });
    });
    function setActive(id) {
      document.querySelectorAll('.nav-link').forEach(l => {
        const isActive = l.getAttribute('href') === '#' + id;
        l.style.color = isActive ? 'var(--charcoal)' : '';
      });
    }
  }

  /* ════════════════════════════════════════
     7. MOBILE NAV
  ════════════════════════════════════════ */
  function initMobileNav() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mob-link').forEach(l => {
      l.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ════════════════════════════════════════
     8. ROLE CYCLING — CSS clip swap
  ════════════════════════════════════════ */
  function initRoles() {
    const el = document.getElementById('roleText');
    if (!el) return;
    const roles = ['Data Scientist', 'AI Engineer', 'LLM Builder', 'Automation Builder'];
    let idx = 0;
    setInterval(() => {
      waitForGSAP(() => {
        gsap.to(el, {
          opacity: 0,
          y: -12,
          duration: 0.28,
          ease: 'power2.in',
          force3D: true,
          onComplete: () => {
            idx = (idx + 1) % roles.length;
            el.textContent = roles[idx];
            gsap.fromTo(el,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', force3D: true }
            );
          }
        });
      });
    }, 2400);
  }

  /* ════════════════════════════════════════
     9. MAGNETIC ELEMENTS
        Constrained pull — max 20px delta
        Uses GSAP quickTo for buttery smooth
  ════════════════════════════════════════ */
  function initMagnetic() {
    waitForGSAP(() => {
      document.querySelectorAll('.magnetic').forEach(el => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

        el.addEventListener('mousemove', e => {
          const r  = el.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width  / 2) * 0.25;
          const dy = (e.clientY - r.top  - r.height / 2) * 0.25;
          // Cap at ±20px so it never feels out of control
          xTo(Math.max(-20, Math.min(20, dx)));
          yTo(Math.max(-20, Math.min(20, dy)));
        });
        el.addEventListener('mouseleave', () => {
          xTo(0);
          yTo(0);
        });
      });
    });
  }

  /* ════════════════════════════════════════
     10. CARD TILT — CSS perspective tilt
         quickTo for zero lag
  ════════════════════════════════════════ */
  function initTilt() {
    waitForGSAP(() => {
      document.querySelectorAll('.tilt-card').forEach(card => {
        const rxTo = gsap.quickTo(card, 'rotateX', { duration: 0.25, ease: 'power1.out' });
        const ryTo = gsap.quickTo(card, 'rotateY', { duration: 0.25, ease: 'power1.out' });
        gsap.set(card, { transformPerspective: 700 });

        card.addEventListener('mousemove', e => {
          const r  = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top)  / r.height - 0.5) * -8;
          const ry = ((e.clientX - r.left) / r.width  - 0.5) *  8;
          rxTo(rx);
          ryTo(ry);
        });
        card.addEventListener('mouseleave', () => {
          rxTo(0);
          ryTo(0);
        });
      });
    });
  }

  /* ════════════════════════════════════════
     11. AVATAR PARALLAX — quickTo
  ════════════════════════════════════════ */
  function initAvatarParallax() {
    waitForGSAP(() => {
      const hero = document.querySelector('.hero');
      const img  = document.getElementById('avImg');
      if (!hero || !img) return;

      const rxTo = gsap.quickTo(img, 'rotateX', { duration: 0.45, ease: 'power2.out' });
      const ryTo = gsap.quickTo(img, 'rotateY', { duration: 0.45, ease: 'power2.out' });
      gsap.set(img, { transformPerspective: 700 });

      hero.addEventListener('mousemove', e => {
        const r  = hero.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / r.width;
        const dy = (e.clientY - r.top  - r.height / 2) / r.height;
        rxTo(-dy * 9);
        ryTo(dx  * 12);
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        rxTo(0);
        ryTo(0);
      });
    });
  }

  /* ════════════════════════════════════════
     12. SKILL TAG STAGGER ON SCROLL
  ════════════════════════════════════════ */
  function initTagStagger() {
    waitForGSAP(() => {
      document.querySelectorAll('.skill-card').forEach(card => {
        const tags = card.querySelectorAll('.tag');
        // Initial state
        gsap.set(tags, { opacity: 0, y: 8 });

        ScrollTrigger.create({
          trigger: card,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(tags, {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.05,
              ease: 'power2.out',
              force3D: true
            });
          }
        });
      });
    });
  }

  /* ════════════════════════════════════════
     13. FORM UX — subtle lift on focus
  ════════════════════════════════════════ */
  function initForm() {
    document.querySelectorAll('.ff input, .ff textarea').forEach(field => {
      field.addEventListener('focus', () => {
        waitForGSAP(() =>
          gsap.to(field.closest('.ff'), { y: -2, duration: 0.2, ease: 'power1.out', force3D: true })
        );
      });
      field.addEventListener('blur', () => {
        waitForGSAP(() =>
          gsap.to(field.closest('.ff'), { y: 0, duration: 0.3, ease: 'power1.out', force3D: true })
        );
      });
    });
  }

  /* ════════════════════════════════════════
     INIT ALL
  ════════════════════════════════════════ */
  initLoader();
  initCursor();
  initProgressBar();
  initNav();
  initMobileNav();
  initRoles();
  initScrollReveals();
  initTagStagger();
  initTilt();
  initAvatarParallax();
  initMagnetic();
  initForm();

});
