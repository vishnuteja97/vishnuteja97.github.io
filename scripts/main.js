/* ==========================================================================
   main.js — vanilla, framework-free behavior layer
   --------------------------------------------------------------------------
   Responsibilities:
     1. Mobile nav toggle (with aria-expanded + outside click + Escape).
     2. Active nav-link highlighting via IntersectionObserver.
     3. Reveal-on-scroll for .reveal elements (skipped under reduced motion).
     4. Project filter chips (toggle aria-pressed; show/hide cards by tag).
     5. Keep the footer year fresh.

   Note: project card expand/collapse is handled natively by the
   <details>/<summary> elements — no JS toggle required.
   ========================================================================== */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1. Mobile nav --------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  const setNavOpen = (open) => {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navMobile.classList.toggle('is-open', open);
    if (open) {
      navMobile.removeAttribute('hidden');
    } else {
      navMobile.setAttribute('hidden', '');
    }
  };

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!isOpen);
    });

    navMobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setNavOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    });

    document.addEventListener('click', (e) => {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      if (e.target instanceof Node && (navMobile.contains(e.target) || navToggle.contains(e.target))) return;
      setNavOpen(false);
    });
  }

  // ---- 2. Active nav link ---------------------------------------------------
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const isMatch = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', isMatch);
      if (isMatch) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  };

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // Trigger when section crosses ~30% from the top of the viewport.
        rootMargin: '-30% 0px -65% 0px',
        threshold: [0, 0.1, 0.5, 1],
      }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  // ---- 3. Reveal-on-scroll --------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  // ---- 4. Project filter chips ---------------------------------------------
  const filterRail = document.getElementById('project-filters');
  const projectsGrid = document.getElementById('projects-grid');

  if (filterRail && projectsGrid) {
    const cards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    const chips = Array.from(filterRail.querySelectorAll('.chip[data-filter]'));

    const applyFilter = (filter) => {
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const match = filter === 'all' || tags.includes(filter);
        if (match) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    };

    filterRail.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const chip = target.closest('.chip[data-filter]');
      if (!chip) return;

      const filter = chip.getAttribute('data-filter') || 'all';
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      applyFilter(filter);
    });
  }

  // ---- 5. Footer year -------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
