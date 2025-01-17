// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');

// Task Array to Store Data
let tasks = [];

// Track currently edited task
let editingTaskId = null;

// Fetch Initial Tasks from a JSON File (Simulated)
async function fetchTasks() {
  const response = await fetch('tasks.json'); // Simulated JSON
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
    if (editingTaskId) {
      // Update existing task
      const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { id: editingTaskId, title, desc, date };
      }
      editingTaskId = null;
      // Reset submit button text after update
      document.querySelector('#task-form button[type="submit"]').textContent = 'Add Task';
    } else {
      // Add new task
      const newTask = { id: Date.now(), title, desc, date };
      tasks.push(newTask);
    }
    renderTasks();
    taskForm.reset();
  }
});

// Render Tasks
function renderTasks() {
  tasksList.innerHTML = '';
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong> - ${task.date}
        <p>${task.desc}</p>
      </div>
      <div>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    editingTaskId = id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.desc;
    document.getElementById('task-date').value = task.date;
    // Update submit button text
    document.querySelector('#task-form button[type="submit"]').textContent = 'Update Task';
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// Initialize App
fetchTasks();