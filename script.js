// // DOM Elements
// const taskForm = document.getElementById('task-form');
// const tasksList = document.getElementById('tasks');

// // Task Array to Store Data
// let tasks = [];

// // Fetch Initial Tasks from a JSON File (Simulated)
// async function fetchTasks() {
//   const response = await fetch('tasks.json'); // Simulated JSON
//   const data = await response.json();
//   tasks = data;
//   renderTasks();
// }

// // Add Task
// taskForm.addEventListener('submit', (e) => {
//   e.preventDefault();
  
//   const title = document.getElementById('task-title').value.trim();
//   const desc = document.getElementById('task-desc').value.trim();
//   const date = document.getElementById('task-date').value;
  
//   if (title && desc && date) {
//     const newTask = { id: Date.now(), title, desc, date };
//     tasks.push(newTask);
//     renderTasks();
//     taskForm.reset();
//   }
// });

// // Render Tasks
// function renderTasks() {
//   tasksList.innerHTML = '';
  
//   tasks.forEach(task => {
//     const li = document.createElement('li');
//     li.innerHTML = `
//       <div>
//         <strong>${task.title}</strong> - ${task.date}
//         <p>${task.desc}</p>
//       </div>
//       <div>
//         <button onclick="editTask(${task.id})">Edit</button>
//         <button onclick="deleteTask(${task.id})">Delete</button>
//       </div>
//     `;
//     tasksList.appendChild(li);
//   });
// }

// // Edit Task
// function editTask(id) {
//   const task = tasks.find(t => t.id === id);
//   if (task) {
//     document.getElementById('task-title').value = task.title;
//     document.getElementById('task-desc').value = task.desc;
//     document.getElementById('task-date').value = task.date;
//     tasks = tasks.filter(t => t.id !== id); // Remove task temporarily
//   }
// }

// // Delete Task
// function deleteTask(id) {
//   tasks = tasks.filter(task => task.id !== id);
//   renderTasks();
// }

// // Initialize App
// fetchTasks();



// HTML Element References
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');
const searchBar = document.getElementById('search-bar');
const sortDropdown = document.getElementById('sort-dropdown');
const filterDropdown = document.getElementById('filter-dropdown');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

// Variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  let filteredTasks = tasks;

  // Search
  const query = searchBar.value.toLowerCase();
  filteredTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(query) || task.desc.toLowerCase().includes(query)
  );

  // Filter
  const filter = filterDropdown.value;
  if (filter === 'completed') {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  } else if (filter === 'incomplete') {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // Sort
  const sortBy = sortDropdown.value;
  filteredTasks.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  // Render tasks
  tasksList.innerHTML = '';
  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <h5>${task.title}</h5>
        <small>Due: ${task.date}</small>
        <p>${task.desc}</p>
      </div>
      <div>
        <button class="btn btn-sm btn-primary" onclick="showEditTaskModal(${task.id})">Edit</button>
        <button class="btn btn-sm btn-success" onclick="toggleTaskCompletion(${task.id})">
          ${task.completed ? 'Mark Incomplete' : 'Mark Completed'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
}

// Fetch tasks from task.json and merge with localStorage data
async function fetchTasks() {
  try {
    const response = await fetch('tasks.json');
    if (!response.ok) throw new Error('Failed to load task.json');

    const fetchedTasks = await response.json();

    // Merge tasks, avoiding duplicates based on ID
    const existingIds = new Set(tasks.map((task) => task.id));
    const newTasks = fetchedTasks.filter((task) => !existingIds.has(task.id));

    tasks = [...tasks, ...newTasks];
    saveTasks();
    renderTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// Add a new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const date = document.getElementById('task-date').value;

  if (title && desc && date) {
    const newTask = { id: Date.now(), title, desc, date, completed: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
  }
});

// Show the edit task modal with pre-filled values
function showEditTaskModal(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    editingTaskId = taskId;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-desc').value = task.desc;
    document.getElementById('edit-task-date').value = task.date;
    editTaskModal.show();
  }
}

// Edit a task
editTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const updatedTitle = document.getElementById('edit-task-title').value.trim();
  const updatedDesc = document.getElementById('edit-task-desc').value.trim();
  const updatedDate = document.getElementById('edit-task-date').value;

  if (updatedTitle && updatedDesc && updatedDate) {
    const task = tasks.find((task) => task.id === editingTaskId);
    if (task) {
      task.title = updatedTitle;
      task.desc = updatedDesc;
      task.date = updatedDate;
      saveTasks();
      renderTasks();
      editTaskModal.hide();
    }
  }
});

// Delete a task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Event listeners for search, sort, and filter
searchBar.addEventListener('input', renderTasks);
sortDropdown.addEventListener('change', renderTasks);
filterDropdown.addEventListener('change', renderTasks);

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  await fetchTasks(); // Fetch tasks from task.json
  renderTasks();      // Render all tasks
});