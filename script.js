/* ═══════════════════════════════════════════════════════
   SHRIYANSH SINGH — Portfolio v3 Script
   Features:
   - Neural particle canvas (custom WebGL-style)
   - GSAP + ScrollTrigger animations
   - Magnetic elements
   - Custom cursor
   - Smooth page load sequence
   - Cyd Stumpel-style text reveals
   - Role cycling animation
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ════════════════════════════════════════
  // 1. GSAP SETUP
  // ════════════════════════════════════════
  gsap.registerPlugin(ScrollTrigger);

  // ════════════════════════════════════════
  // 2. LOADER
  // ════════════════════════════════════════
  function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('hidden');
      initHeroEntrance();
    }, 1500);
  }

  // ════════════════════════════════════════
  // 3. HERO ENTRANCE — GSAP timeline
  // ════════════════════════════════════════
  function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.7 })
      .from('.name-line', {
        opacity: 0,
        y: 80,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out'
      }, '-=0.3')
      .from('.hero-role', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.hero-bio', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.hero-socials', { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
      .from('.avatar-frame', {
        opacity: 0,
        scale: 0.85,
        duration: 1,
        ease: 'back.out(1.4)'
      }, '-=1.2')
      .from('.float-badge', {
        opacity: 0,
        scale: 0.7,
        duration: 0.5,
        stagger: 0.12,
        ease: 'back.out(1.8)'
      }, '-=0.5')
      .from('.hero-stats', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
      .from('.scroll-cue', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2')
      .from('.glow', { opacity: 0, duration: 2, stagger: 0.4 }, 0);
  }

  // ════════════════════════════════════════
  // 4. SCROLL REVEAL — all [data-gsap] elements
  // ════════════════════════════════════════
  function initScrollAnimations() {
    document.querySelectorAll('[data-gsap="fade-up"]').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 3) * 0.1   // subtle stagger within viewport batches
      });
    });

    // Section titles — split line reveal (Cyd Stumpel style)
    document.querySelectorAll('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power4.out'
      });
    });

    // Section labels
    document.querySelectorAll('.section-label').forEach(label => {
      gsap.from(label, {
        scrollTrigger: { trigger: label, start: 'top 92%' },
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Skill cards — wave stagger
    gsap.from('.skill-card', {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%'
      },
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.7,
      stagger: { amount: 0.5, from: 'start' },
      ease: 'power3.out'
    });

    // Project rows — slide in from left
    document.querySelectorAll('.project-row').forEach((row, i) => {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 88%' },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.12
      });
    });

    // About cards
    gsap.from('.info-card', {
      scrollTrigger: {
        trigger: '.about-cards',
        start: 'top 80%'
      },
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.4)'
    });

    // Marquee fade in
    gsap.from('.marquee-strip', {
      scrollTrigger: { trigger: '.marquee-strip', start: 'top 100%' },
      opacity: 0,
      duration: 0.8
    });

    // Contact items
    gsap.from('.c-item', {
      scrollTrigger: {
        trigger: '.contact-items',
        start: 'top 85%'
      },
      opacity: 0,
      x: -25,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Highlight numbers count-up
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          let count = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(count);
            }
          }, 16);
        }
      });
    });
  }

  // ════════════════════════════════════════
  // 5. NEURAL CANVAS — particle network
  //    Inspired by Bruno Simon's interactive feel
  //    but kept subtle — not overwhelming
  // ════════════════════════════════════════
  function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles, mouse = { x: null, y: null };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle class
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.5 + 0.5;
        // Violet or cyan tint
        this.isViolet = Math.random() > 0.5;
      }
      update() {
        // Gentle mouse repulsion — the Bruno Simon nod
        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.6;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
          }
        }
        // Damping
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;
        // Wrap around edges
        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.isViolet
          ? 'rgba(139, 92, 246, 0.7)'
          : 'rgba(6, 182, 212, 0.6)';
        ctx.fill();
      }
    }

    function initParticles() {
      const count = window.innerWidth < 768 ? 50 : 100;
      particles = Array.from({ length: count }, () => new Particle());
    }
    initParticles();

    function drawConnections() {
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            // Connection color blends violet→cyan based on particle types
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(139,92,246,${alpha})`);
            gradient.addColorStop(1, `rgba(6,182,212,${alpha})`);
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ════════════════════════════════════════
  // 6. CUSTOM CURSOR
  // ════════════════════════════════════════
  function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Smooth trailing ring
    (function followRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(followRing);
    })();

    // Hover states
    const hoverTargets = document.querySelectorAll(
      'a, button, .magnetic, .tag, .skill-card, .info-card'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      });
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  // ════════════════════════════════════════
  // 7. MAGNETIC ELEMENTS — Cyd Stumpel style
  // ════════════════════════════════════════
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        gsap.to(el, {
          x: dx, y: dy,
          duration: 0.35,
          ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ════════════════════════════════════════
  // 8. NAV SCROLL EFFECT
  // ════════════════════════════════════════
  function initNav() {
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
      start: 60,
      onUpdate: self => {
        nav.classList.toggle('scrolled', self.scroll() > 60);
      }
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => highlightLink(sec.id),
        onEnterBack: () => highlightLink(sec.id)
      });
    });
    function highlightLink(id) {
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === '#' + id
          ? 'var(--text)'
          : '';
      });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ════════════════════════════════════════
  // 9. MOBILE NAV
  // ════════════════════════════════════════
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow =
        mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ════════════════════════════════════════
  // 10. PROGRESS BAR
  // ════════════════════════════════════════
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.classList.add('progress-bar');
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const pct = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = pct + '%';
    });
  }

  // ════════════════════════════════════════
  // 11. ROLE CYCLING ANIMATION
  // ════════════════════════════════════════
  function initRoleCycling() {
    const roles = document.querySelectorAll('.role-item');
    let current = 0;
    setInterval(() => {
      roles[current].classList.remove('active');
      current = (current + 1) % roles.length;
      roles[current].classList.add('active');
    }, 2200);
  }

  // ════════════════════════════════════════
  // 12. SKILL TAGS STAGGER ON SCROLL
  // ════════════════════════════════════════
  function initSkillTags() {
    document.querySelectorAll('.skill-card').forEach(card => {
      const tags = card.querySelectorAll('.tag');
      tags.forEach(t => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          tags.forEach((t, i) => {
            setTimeout(() => {
              t.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              t.style.opacity = '1';
              t.style.transform = 'translateY(0)';
            }, i * 55);
          });
        }
      });
    });
  }

  // ════════════════════════════════════════
  // 13. CARD 3D TILT on hover
  // ════════════════════════════════════════
  function initTilt() {
    document.querySelectorAll('.info-card, .skill-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top)  / r.height - 0.5) * -10;
        const ry = ((e.clientX - r.left) / r.width  - 0.5) *  10;
        gsap.to(card, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.3,
          ease: 'power1.out',
          transformPerspective: 700,
          transformOrigin: 'center'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ════════════════════════════════════════
  // 14. AVATAR PARALLAX
  // ════════════════════════════════════════
  function initAvatarParallax() {
    const hero = document.querySelector('.hero');
    const img  = document.querySelector('.avatar-img');
    if (!hero || !img) return;

    hero.addEventListener('mousemove', e => {
      const r  = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left  - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top   - r.height / 2) / r.height;
      gsap.to(img, {
        rotateY: dx * 12,
        rotateX: -dy * 8,
        scale: 1.04,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });
    hero.addEventListener('mouseleave', () => {
      gsap.to(img, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  }

  // ════════════════════════════════════════
  // 15. FORM HANDLING
  // ════════════════════════════════════════
  function initForm() {
    // Let Formspree handle actual submission natively
    // Add focus glow effect to fields
    document.querySelectorAll('.form-field input, .form-field textarea').forEach(field => {
      field.addEventListener('focus', () => {
        gsap.to(field.closest('.form-field'), { y: -2, duration: 0.2 });
      });
      field.addEventListener('blur', () => {
        gsap.to(field.closest('.form-field'), { y: 0, duration: 0.3 });
      });
    });
  }

  // ════════════════════════════════════════
  // 16. SECTION BG PARALLAX
  // ════════════════════════════════════════
  function initParallax() {
    gsap.utils.toArray('.glow').forEach(el => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        },
        y: -150,
        ease: 'none'
      });
    });
  }

  // ════════════════════════════════════════
  // INIT ALL
  // ════════════════════════════════════════
  try { initNeuralCanvas();   } catch(e) { console.warn('Canvas:', e); }
  try { initCursor();         } catch(e) { console.warn('Cursor:', e); }
  try { initProgressBar();    } catch(e) { console.warn('Progress:', e); }
  try { initNav();            } catch(e) { console.warn('Nav:', e); }
  try { initMobileNav();      } catch(e) { console.warn('MobileNav:', e); }
  try { initRoleCycling();    } catch(e) { console.warn('Roles:', e); }
  try { initScrollAnimations();} catch(e) { console.warn('ScrollAnim:', e); }
  try { initSkillTags();      } catch(e) { console.warn('SkillTags:', e); }
  try { initTilt();           } catch(e) { console.warn('Tilt:', e); }
  try { initAvatarParallax(); } catch(e) { console.warn('Parallax:', e); }
  try { initMagnetic();       } catch(e) { console.warn('Magnetic:', e); }
  try { initParallax();       } catch(e) { console.warn('BgParallax:', e); }
  try { initForm();           } catch(e) { console.warn('Form:', e); }
  try { initLoader();         } catch(e) { console.warn('Loader:', e); }

});
