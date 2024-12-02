// HTML Element References
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');
const searchBar = document.getElementById('search-bar');
const sortDropdown = document.getElementById('sort-dropdown');
const filterDropdown = document.getElementById('filter-dropdown');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

// Variables
let tasks = [];
let editingTaskId = null;

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

// Fetch tasks from task.json
async function fetchTasks() {
  try {
    const response = await fetch('tasks.json');
    if (!response.ok) throw new Error('Failed to load task.json');
    tasks = await response.json();
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
    renderTasks();
    taskForm.reset();
  }
});

// Show the edit task modal
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
      renderTasks();
      editTaskModal.hide();
    }
  }
});

// Delete a task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// Search, Sort, and Filter Events
searchBar.addEventListener('input', renderTasks);
sortDropdown.addEventListener('change', renderTasks);
filterDropdown.addEventListener('change', renderTasks);

// Initial fetch
fetchTasks();