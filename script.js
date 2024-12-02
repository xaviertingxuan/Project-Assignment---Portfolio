let tasks = [];
let editingTaskId = null;

// Fetch tasks from task.json using a GET request
function fetchTasks() {
    fetch('tasks.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            tasks = data;
            renderTasks();
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// // Fetch tasks from task.json
// async function fetchTasks() {
//     try {
//       const response = await fetch('tasks.json');
//       if (!response.ok) throw new Error('Failed to load task.json');
//       tasks = await response.json();
//       renderTasks();
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   }

// Render tasks to the UI
function renderTasks() {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const sortBy = document.getElementById('sort-dropdown').value;
    const filterBy = document.getElementById('filter-dropdown').value;

    let filteredTasks = tasks.filter((task) => {
        return task.title.toLowerCase().includes(searchTerm);
    });

    if (filterBy === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filterBy === 'incomplete') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // Sort tasks based on selected option
    if (sortBy === 'title') {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date-asc') {
        filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'date-desc') {
        filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filteredTasks.forEach((task) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        listItem.innerHTML = `
            <div class="w-100">
                <strong>${task.title}</strong>
                <p>${task.desc} <small>${task.date}</small></p>
            </div>
            <div class="btn-group">
                <button class="btn btn-info btn-sm" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                <button class="btn btn-${task.completed ? 'warning' : 'success'} btn-sm" onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
            </div>
        `;

        tasksContainer.appendChild(listItem);
    });
}

// Add new task
document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const date = document.getElementById('task-date').value;

    const newTask = {
        id: tasks.length + 1, // Simple ID generation
        title,
        desc,
        date,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();

    // Clear input fields
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
});

// Edit a task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.desc;
        document.getElementById('task-date').value = task.date;
        editingTaskId = taskId;
    }
}

// Update the task
document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const updatedTitle = document.getElementById('task-title').value;
    const updatedDesc = document.getElementById('task-desc').value;
    const updatedDate = document.getElementById('task-date').value;

    if (editingTaskId) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.title = updatedTitle;
            task.desc = updatedDesc;
            task.date = updatedDate;
            renderTasks();
            editingTaskId = null;

            // Clear input fields
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value = '';
            document.getElementById('task-date').value = '';
        }
    }
});

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Event listeners for search, sort, and filter
document.getElementById('search-bar').addEventListener('input', renderTasks);
document.getElementById('sort-dropdown').addEventListener('change', renderTasks);
document.getElementById('filter-dropdown').addEventListener('change', renderTasks);

// Initial fetch of tasks
fetchTasks();