document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Header shadow / mobile nav toggle ---------- */
  const nav = document.getElementById('mainNav');
  const toggleBtn = document.getElementById('navToggle');

  function closeNav() {
    nav.classList.remove('open');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  function openNav() {
    nav.classList.add('open');
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
  }
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Active nav item on scroll ---------- */
  const sections = document.querySelectorAll('main .section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(item => {
          item.classList.toggle('active', item.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Reveal-on-scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Skill dot-rating fill on reveal ---------- */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = parseInt(entry.target.dataset.level, 10) || 0;
        const dots = entry.target.querySelectorAll('.dot-rating span');
        const filled = Math.max(1, Math.round((level / 100) * dots.length));
        dots.forEach((dot, i) => {
          if (i < filled) {
            setTimeout(() => dot.classList.add('on'), i * 90);
          }
        });
        entry.target.classList.add('filled');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill-row').forEach(el => skillObserver.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progressRatio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      el.textContent = Math.round(eased * target);
      if (progressRatio < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  /* ---------- Typing animation for hero role ---------- */
  const roles = [
    'Software Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    '.NET Developer',
    'Angular Developer'
  ];
  const typedEl = document.getElementById('typedRole');

  if (typedEl) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      typedEl.textContent = roles[roleIndex].substring(0, charIndex);
      setTimeout(typeLoop, deleting ? 40 : 80);
    }

    charIndex = roles[0].length;
    deleting = true;
    setTimeout(typeLoop, 1600);
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.style.color = '#E5695A';
        status.textContent = 'Please fill in every field.';
        return;
      }

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:shimalhashimi@gmail.com?subject=${subject}&body=${body}`;

      status.style.color = '#6FBF8B';
      status.textContent = 'Opening your email app to send this message...';
      form.reset();
    });
  }

  /* ---------- Download CV placeholder ---------- */
  ['downloadCv', 'downloadCv2'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  });

});
