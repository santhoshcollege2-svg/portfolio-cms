const API_URL = 'https://santhosh-portfolio-backend-p6gw.onrender.com/api';
let token = localStorage.getItem('adminToken');
let editingId = null;

if (token) {
  showDashboard();
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Login failed';
      return;
    }

    token = data.token;
    localStorage.setItem('adminToken', token);
    showDashboard();
  } catch (err) {
    errorEl.textContent = 'Could not connect to server';
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  token = null;
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
}

function showDashboard() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.remove('hidden');
  loadProjectsList();
}

async function uploadImageIfNeeded() {
  const fileInput = document.getElementById('new-image');
  const file = fileInput.files[0];
  if (!file) return null;

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  return data.url;
}

async function saveProject() {
  const title = document.getElementById('new-title').value;
  const description = document.getElementById('new-description').value;
  const techStack = document.getElementById('new-tech').value.split(',').map(t => t.trim());
  const githubLink = document.getElementById('new-github').value;
  const errorEl = document.getElementById('add-error');

  try {
    const imageUrl = await uploadImageIfNeeded();
    const body = { title, description, techStack, githubLink };
    if (imageUrl) body.image = imageUrl;

    const url = editingId ? `${API_URL}/projects/${editingId}` : `${API_URL}/projects`;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Failed to save project';
      return;
    }

    resetForm();
    loadProjectsList();
  } catch (err) {
    errorEl.textContent = 'Could not connect to server';
  }
}

function resetForm() {
  document.getElementById('new-title').value = '';
  document.getElementById('new-description').value = '';
  document.getElementById('new-tech').value = '';
  document.getElementById('new-github').value = '';
  document.getElementById('new-image').value = '';
  document.getElementById('edit-id').value = '';
  document.getElementById('add-error').textContent = '';
  document.getElementById('form-heading').textContent = 'Add New Project';
  document.getElementById('save-btn').textContent = 'Add Project';
  document.getElementById('cancel-btn').classList.add('hidden');
  editingId = null;
}

function cancelEdit() {
  resetForm();
}

async function loadProjectsList() {
  const res = await fetch(`${API_URL}/projects`);
  const projects = await res.json();

  const listEl = document.getElementById('project-list');
  listEl.innerHTML = projects.map(p => `
    <div class="project-item">
      <h4>${p.title}</h4>
      <p>${p.description}</p>
      <button onclick='editProject(${JSON.stringify(p).replace(/'/g, "&apos;")})'>Edit</button>
      <button class="delete-btn" onclick="deleteProject('${p._id}')">Delete</button>
    </div>
  `).join('');
}

function editProject(project) {
  editingId = project._id;
  document.getElementById('edit-id').value = project._id;
  document.getElementById('new-title').value = project.title;
  document.getElementById('new-description').value = project.description;
  document.getElementById('new-tech').value = project.techStack.join(', ');
  document.getElementById('new-github').value = project.githubLink || '';
  document.getElementById('form-heading').textContent = 'Edit Project';
  document.getElementById('save-btn').textContent = 'Update Project';
  document.getElementById('cancel-btn').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;

  await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  loadProjectsList();
}