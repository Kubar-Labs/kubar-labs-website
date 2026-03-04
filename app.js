/* app.js — Kubar Labs */

(function() {
  'use strict';

  // QA mode — add class to body to force all reveals visible
  if (window.location.search.includes('qa=1')) {
    document.body.classList.add('qa-mode');
  }

  /* ==================== PARTICLE CANVAS ==================== */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let w, h;
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 140;
    const MOUSE = { x: -1000, y: -1000 };

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1,
          isTeal: Math.random() > 0.3
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = particles[i].isTeal ? 
              `rgba(0, 212, 170, ${alpha})` : 
              `rgba(255, 181, 71, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      for (let p of particles) {
        // Mouse interaction
        const mdx = MOUSE.x - p.x;
        const mdy = MOUSE.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200) {
          const force = (200 - mdist) / 200 * 0.015;
          p.vx += mdx * force;
          p.vy += mdy * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isTeal ? 'rgba(0, 212, 170, 0.6)' : 'rgba(255, 181, 71, 0.4)';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    // Only run canvas when hero is in view
    let canvasRunning = false;
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !canvasRunning) {
          canvasRunning = true;
          draw();
        } else if (!entry.isIntersecting && canvasRunning) {
          canvasRunning = false;
          cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.1 });

    resize();
    createParticles();
    heroObserver.observe(canvas.closest('.hero'));

    window.addEventListener('resize', () => { resize(); createParticles(); });
    canvas.closest('.hero').addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      MOUSE.x = e.clientX - rect.left;
      MOUSE.y = e.clientY - rect.top;
    });
    canvas.closest('.hero').addEventListener('mouseleave', () => {
      MOUSE.x = -1000;
      MOUSE.y = -1000;
    });
  }

  /* ==================== SCROLL REVEAL ==================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // Immediately trigger reveals for elements already in viewport
  // (handles hash navigation and instant scroll)
  function triggerVisibleReveals() {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        el.classList.add('visible');
      }
    });
  }
  // Run immediately AND after a frame to catch hash scrolls
  triggerVisibleReveals();
  requestAnimationFrame(triggerVisibleReveals);
  // Also handle hash changes
  window.addEventListener('hashchange', () => {
    requestAnimationFrame(triggerVisibleReveals);
  });

  /* ==================== ANIMATED COUNTERS ==================== */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el, target) {
    const duration = 1200;
    const startTime = performance.now();
    const easing = t => 1 - Math.pow(1 - t, 4); // ease-out quart

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      el.textContent = Math.round(target * easedProgress);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ==================== PROBLEM STAT COUNTER ==================== */
  const problemStat = document.querySelector('.problem-stat');
  if (problemStat) {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(problemStat.getAttribute('data-counter'));
          const prefix = problemStat.getAttribute('data-prefix') || '';
          const suffix = problemStat.getAttribute('data-suffix') || '';
          const duration = 1500;
          const startTime = performance.now();
          const easing = t => 1 - Math.pow(1 - t, 4);

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            problemStat.textContent = prefix + Math.round(target * easedProgress) + suffix;
            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }
          requestAnimationFrame(update);
          statObserver.unobserve(problemStat);
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(problemStat);
  }

  /* ==================== NAVIGATION ==================== */
  // Sticky nav background on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==================== TAB TOGGLE ==================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      const targetPanel = document.getElementById('tab-' + tabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Re-trigger stagger animation
        const stagger = targetPanel.querySelector('.reveal-stagger');
        if (stagger) {
          stagger.classList.remove('visible');
          void stagger.offsetWidth; // force reflow
          stagger.classList.add('visible');
        }
      }
    });
  });

  /* ==================== ACTIVE NAV LINK ==================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--color-text)';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

})();