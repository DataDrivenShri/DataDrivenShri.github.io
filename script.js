/* ═══════════════════════════════════════════════════════════
   SHRIYANSH SINGH — PORTFOLIO JAVASCRIPT
   Handles: Custom cursor, particles, scroll animations,
            nav scroll effect, form submission, reveal
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════
  // 1. CUSTOM CURSOR
  // ═══════════════════════════════
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trailing cursor
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '0.6';
  });

  // ═══════════════════════════════
  // 2. BACKGROUND PARTICLES
  // ═══════════════════════════════
  const bgCanvas = document.getElementById('bgCanvas');

  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size  = Math.random() * 120 + 40;
    const left  = Math.random() * 100;
    const delay = Math.random() * 15;
    const dur   = Math.random() * 20 + 15;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    bgCanvas.appendChild(p);

    // Remove and recreate to keep count managed
    setTimeout(() => {
      p.remove();
      createParticle();
    }, (dur + delay) * 1000);
  }

  // Create initial particles
  for (let i = 0; i < 14; i++) {
    createParticle();
  }

  // ═══════════════════════════════
  // 3. NAV SCROLL EFFECT
  // ═══════════════════════════════
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ═══════════════════════════════
  // 4. SCROLL REVEAL ANIMATIONS
  // ═══════════════════════════════
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('[data-reveal]')]
          : [];
        const index = siblings.indexOf(entry.target);
        const delay = index * 80;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════
  // 5. SMOOTH NAV LINK SCROLL
  // ═══════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ═══════════════════════════════
  // 6. ACTIVE NAV LINK HIGHLIGHT
  // ═══════════════════════════════
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent-2)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  // ═══════════════════════════════
  // 7. PARALLAX ON HERO AVATAR
  // ═══════════════════════════════
  const avatarContainer = document.querySelector('.avatar-container');

  if (avatarContainer) {
    document.addEventListener('mousemove', (e) => {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const rect   = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) / rect.width;
      const deltaY  = (e.clientY - centerY) / rect.height;

      avatarContainer.style.transform =
        `perspective(800px) rotateY(${deltaX * 8}deg) rotateX(${-deltaY * 6}deg) translateZ(10px)`;
    });

    document.querySelector('.hero').addEventListener('mouseleave', () => {
      avatarContainer.style.transform =
        'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  }

  // ═══════════════════════════════
  // 8. PROJECT CARD 3D TILT
  // ═══════════════════════════════
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const midX   = rect.width  / 2;
      const midY   = rect.height / 2;
      const rotateX = ((y - midY) / midY) * -6;
      const rotateY = ((x - midX) / midX) *  6;

      card.querySelector('.project-card-inner').style.transform =
        `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('.project-card-inner').style.transform = '';
    });
  });

  // ═══════════════════════════════
  // 9. SKILL TAGS STAGGER
  // ═══════════════════════════════
  document.querySelectorAll('.skill-category').forEach(category => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, i) => {
            setTimeout(() => {
              tag.style.opacity    = '1';
              tag.style.transform  = 'translateY(0)';
            }, i * 60);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    // Set initial state
    category.querySelectorAll('.skill-tag').forEach(tag => {
      tag.style.opacity   = '0';
      tag.style.transform = 'translateY(12px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    observer.observe(category);
  });

  // ═══════════════════════════════
  // 10. CONTACT FORM
  // ═══════════════════════════════
  window.handleForm = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending... ⏳';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '✅ Message Sent!';
      showToast('Message sent! I\'ll get back to you soon. 🚀');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled  = false;
        e.target.reset();
      }, 3000);
    }, 1200);
  };

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.classList.add('toast');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ═══════════════════════════════
  // 11. HERO NAME SLIDE-UP ANIMATION
  //     Animate entire word as a block — no letter splitting
  //     so "Shriyansh" stays on ONE line always
  // ═══════════════════════════════
  function animateHeroText() {
    const lines = document.querySelectorAll('.hero-name .line');
    lines.forEach((line, i) => {
      // CRITICAL: DO NOT set overflow:hidden — it clips the large font
      // Use opacity + translateY only
      line.style.display         = 'block';
      line.style.whiteSpace      = 'nowrap'; /* hard lock — single line */
      line.style.opacity         = '0';
      line.style.transform       = 'translateY(50px)';
      line.style.transition      = `opacity 0.75s ease, transform 0.75s cubic-bezier(0.16,1,0.3,1)`;
      line.style.transitionDelay = `${i * 130}ms`;

      setTimeout(() => {
        line.style.opacity   = '1';
        line.style.transform = 'translateY(0)';
      }, 100 + i * 130);
    });
  }

  animateHeroText();

  // ═══════════════════════════════
  // 12. COUNT-UP ANIMATION FOR METRICS
  // ═══════════════════════════════
  function countUp(el, target, suffix, duration) {
    const start     = 0;
    const increment = target / (duration / 16);
    let   current   = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const vals = entry.target.querySelectorAll('.metric-val');
        vals.forEach(val => {
          const text = val.textContent;
          const num  = parseFloat(text);
          if (!isNaN(num) && text.includes('%')) {
            countUp(val, num, '%', 1200);
          } else if (!isNaN(num) && !text.includes('+')) {
            countUp(val, num, '', 1000);
          }
        });
        metricObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.project-metrics').forEach(el => {
    metricObserver.observe(el);
  });

  // ═══════════════════════════════
  // 13. GLOW EFFECT ON CURSOR NEAR CARDS
  // ═══════════════════════════════
  document.querySelectorAll('.info-card, .skill-category, .contact-link-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(242, 68, 85, 0.08) 0%, 
          var(--bg-card) 60%)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ═══════════════════════════════
  // 14. SCROLL PROGRESS BAR
  // ═══════════════════════════════
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #F24455, #FF94B2);
    z-index: 9999;
    transition: width 0.1s linear;
    width: 0%;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

});
