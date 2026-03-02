document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initMobileNav();
  loadProjects();
  initContactForm();
});

/* ============================================
   Scroll Reveal via IntersectionObserver
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}

/* ============================================
   Navbar scroll behavior
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ============================================
   Mobile Navigation
   ============================================ */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  let overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      toggle.classList.add('active');
      menu.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================
   Load & Render Projects
   ============================================ */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  const filterContainer = document.getElementById('projectsFilter');

  try {
    const res = await fetch('/data/projects.json');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const projects = await res.json();

    if (projects.length === 0) {
      grid.innerHTML = '<p class="projects-loading">No projects yet. Check back soon!</p>';
      return;
    }

    const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
    filterContainer.innerHTML = categories
      .map(
        (cat, i) =>
          `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat}">${cat}</button>`
      )
      .join('');

    renderProjects(projects, grid);

    filterContainer.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.dataset.filter;
      const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
      renderProjects(filtered, grid);
    });
  } catch {
    grid.innerHTML = '<p class="projects-loading">Could not load projects.</p>';
  }
}

function renderProjects(projects, container) {
  container.innerHTML = projects
    .map(
      (p) => `
    <div class="project-card">
      ${
        p.imageUrl
          ? `<img class="project-image" src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy">`
          : '<div class="project-image-placeholder">&#x1F4BB;</div>'
      }
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-description">${escapeHtml(p.description)}</p>
        <div class="project-tags">
          ${(p.tags || []).map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-links">
          ${
            p.githubUrl
              ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener" class="project-link">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>`
              : ''
          }
          ${
            p.liveUrl
              ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener" class="project-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Live Demo
                </a>`
              : ''
          }
        </div>
      </div>
    </div>
  `
    )
    .join('');

  requestAnimationFrame(() => {
    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 100);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================
   Contact Form (client-side only for now)
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    const mailtoLink = `mailto:abdullahqazi795@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\n${message}`
    )}`;
    window.location.href = mailtoLink;

    form.reset();
  });
}
