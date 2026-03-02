const API = '/api';
let token = localStorage.getItem('admin_token');

document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
  }
  initLogin();
  initLogout();
  initModal();
});

/* ============================================
   Authentication
   ============================================ */
function initLogin() {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Login failed';
        return;
      }

      token = data.token;
      localStorage.setItem('admin_token', token);
      showDashboard();
    } catch {
      errorEl.textContent = 'Network error. Please try again.';
    }
  });
}

function initLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    token = null;
    localStorage.removeItem('admin_token');
    showLogin();
  });
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadAdminProjects();
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/* ============================================
   Project CRUD
   ============================================ */
async function loadAdminProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '<p class="loading-text">Loading...</p>';

  try {
    const res = await fetch(`${API}/projects`);
    if (!res.ok) throw new Error();
    const projects = await res.json();

    if (projects.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <p>No projects yet. Add your first one!</p>
        </div>`;
      return;
    }

    list.innerHTML = projects
      .map(
        (p) => `
      <div class="project-row" data-id="${p.id}">
        ${
          p.imageUrl
            ? `<img class="project-row-thumb" src="${esc(p.imageUrl)}" alt="${esc(p.title)}">`
            : '<div class="project-row-thumb-placeholder">&#x1F4BB;</div>'
        }
        <div class="project-row-info">
          <div class="project-row-title">${esc(p.title)}</div>
          <div class="project-row-category">${esc(p.category || 'Uncategorized')}</div>
        </div>
        <div class="project-row-actions">
          <button class="btn btn-outline btn-sm edit-btn" data-id="${p.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}">Delete</button>
        </div>
      </div>
    `
      )
      .join('');

    list.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editProject(projects.find((p) => p.id === btn.dataset.id)));
    });

    list.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => deleteProject(btn.dataset.id));
    });
  } catch {
    list.innerHTML = '<p class="loading-text">Failed to load projects.</p>';
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const res = await fetch(`${API}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (res.status === 401) {
      alert('Session expired. Please log in again.');
      showLogin();
      return;
    }

    if (!res.ok) throw new Error();
    loadAdminProjects();
  } catch {
    alert('Failed to delete project.');
  }
}

/* ============================================
   Modal & Form
   ============================================ */
let editingId = null;

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('formCancel');
  const addBtn = document.getElementById('addProjectBtn');
  const form = document.getElementById('projectForm');

  addBtn.addEventListener('click', () => openModal());
  closeBtn.addEventListener('click', () => closeModal());
  cancelBtn.addEventListener('click', () => closeModal());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProject();
  });
}

function openModal(project = null) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');

  if (project) {
    title.textContent = 'Edit Project';
    editingId = project.id;
    document.getElementById('projTitle').value = project.title || '';
    document.getElementById('projDescription').value = project.description || '';
    document.getElementById('projImageUrl').value = project.imageUrl || '';
    document.getElementById('projTags').value = (project.tags || []).join(', ');
    document.getElementById('projCategory').value = project.category || '';
    document.getElementById('projGithub').value = project.githubUrl || '';
    document.getElementById('projLive').value = project.liveUrl || '';
  } else {
    title.textContent = 'Add Project';
    editingId = null;
    document.getElementById('projectForm').reset();
  }

  overlay.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  editingId = null;
}

function editProject(project) {
  openModal(project);
}

async function saveProject() {
  const payload = {
    title: document.getElementById('projTitle').value.trim(),
    description: document.getElementById('projDescription').value.trim(),
    imageUrl: document.getElementById('projImageUrl').value.trim(),
    tags: document
      .getElementById('projTags')
      .value.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    category: document.getElementById('projCategory').value.trim(),
    githubUrl: document.getElementById('projGithub').value.trim(),
    liveUrl: document.getElementById('projLive').value.trim(),
  };

  try {
    const url = editingId ? `${API}/projects/${editingId}` : `${API}/projects`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      alert('Session expired. Please log in again.');
      showLogin();
      return;
    }

    if (!res.ok) throw new Error();

    closeModal();
    loadAdminProjects();
  } catch {
    alert('Failed to save project. Please try again.');
  }
}

/* ============================================
   Utility
   ============================================ */
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
