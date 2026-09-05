function updateClock() {
  const clockEl = document.getElementById('clock');
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  clockEl.textContent = now.toLocaleDateString('en-US', options);
}

updateClock();
setInterval(updateClock, 1000);

// Toggle windows when dock icons are clicked
document.querySelectorAll('.dock-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const app = icon.getAttribute('data-app');
    const win = document.getElementById(`window-${app}`);
    if (win) {
      if (icon.classList.contains('has-minimized')) {
        win.classList.add('active');
        icon.classList.remove('has-minimized');
      } else {
        win.classList.toggle('active');
      }
    }
  });
});

// Close window when the red button is clicked
document.querySelectorAll('.window .btn.close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.window').classList.remove('active');
  });
});

// Make windows draggable by their header
document.querySelectorAll('.window').forEach(win => {
  const header = win.querySelector('.window-header');
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});

// Minimize button — shrinks window toward the dock, then hides it
document.querySelectorAll('.window .btn.minimize').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const win = e.target.closest('.window');
    const appName = win.id.replace('window-', '');
    const dockIcon = document.querySelector(`.dock-icon[data-app="${appName}"]`);

    win.classList.add('minimizing');
    setTimeout(() => {
      win.classList.remove('active');
      win.classList.remove('minimizing');
      dockIcon.classList.add('has-minimized'); // show the indicator dot
    }, 300);
  });
});

// Hover preview + click-to-restore for minimized windows
document.querySelectorAll('.dock-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const app = icon.getAttribute('data-app');
    const win = document.getElementById(`window-${app}`);
    if (win && icon.classList.contains('has-minimized')) {
      win.classList.add('active');
      icon.classList.remove('has-minimized');
    }
  });
});

// Maximize button — toggles full-screen size
document.querySelectorAll('.window .btn.maximize').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const win = e.target.closest('.window');
    win.classList.toggle('maximized');
  });
});

async function loadProjects() {
  const container = document.getElementById('projects-content');
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    const projects = await response.json();

    if (projects.length === 0) {
      container.innerHTML = '<p>No projects added yet.</p>';
      return;
    }

    container.innerHTML = projects.map(project => `
  <div class="project-card">
    ${project.image ? `<img src="${project.image}" class="project-image">` : ''}
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <p class="tech-stack">${project.techStack.join(', ')}</p>
    ${project.githubLink ? `<a href="${project.githubLink}" target="_blank">GitHub</a>` : ''}
  </div>
`).join('');
  } catch (err) {
    container.innerHTML = '<p>Failed to load projects. Is the backend running?</p>';
  }
}

loadProjects();