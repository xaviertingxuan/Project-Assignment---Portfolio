// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');

// Task Array
let tasks = [];

// Fetch Tasks from JSON
async function fetchTasks() {
  const response = await fetch('tasks.json');
  const data = await response.json();
  tasks = data;
  renderTasks();
}

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const date = document.getElementById('task-date').value;
  
  if (title && desc && date) {
    const newTask = { id: Date.now(), title, desc, date };
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
  }
});

// Render Tasks
function renderTasks() {
  tasksList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <div>
        <h5>${task.title}</h5>
        <small>Due: ${task.date}</small>
        <p>${task.desc}</p>
      </div>
      <div>
        <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
}

// Edit Task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.desc;
    document.getElementById('task-date').value = task.date;
    tasks = tasks.filter((t) => t.id !== id);
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

// Initialize App
fetchTasks();