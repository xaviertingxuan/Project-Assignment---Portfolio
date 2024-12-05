// Global tasks array and editing task ID
let tasks = [];
let editingTaskId = null;

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

// Render tasks to the UI
function renderTasks() {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const sortBy = document.getElementById('sort-dropdown').value;
    const filterBy = document.getElementById('filter-dropdown').value;

    let filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm));

    if (filterBy === 'completed') {
        filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (filterBy === 'incomplete') {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    if (sortBy === 'title') {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date-asc') {
        filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'date-desc') {
        filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filteredTasks.forEach((task) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-start';

        listItem.innerHTML = `
            <div class="task-info">
                <strong>${task.title}</strong>
                <p>${task.desc} <small>${task.date}</small></p>
            </div>
            <div class="button-container">
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
function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const date = document.getElementById('task-date').value;

    if (!title || !desc || !date) {
        alert('Please fill in all fields!');
        return;
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        desc,
        date,
        completed: false,
    };

    tasks.push(newTask);
    renderTasks();

    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
}

// Edit a task
function editTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.desc;
        document.getElementById('task-date').value = task.date;
        editingTaskId = taskId;

        // Show popup (optional)
        document.getElementById('task-form-title').innerText = 'Edit Task';
        document.getElementById('task-modal').style.display = 'block';
    }
}

// Update a task
function updateTask(event) {
    event.preventDefault();

    const updatedTitle = document.getElementById('task-title').value.trim();
    const updatedDesc = document.getElementById('task-desc').value.trim();
    const updatedDate = document.getElementById('task-date').value;

    if (!updatedTitle || !updatedDesc || !updatedDate) {
        alert('Please fill in all fields!');
        return;
    }

    if (editingTaskId !== null) {
        const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = updatedTitle;
            tasks[taskIndex].desc = updatedDesc;
            tasks[taskIndex].date = updatedDate;
        }

        editingTaskId = null;
        renderTasks();

        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-date').value = '';

        // Hide popup (optional)
        document.getElementById('task-form-title').innerText = 'Add Task';
        document.getElementById('task-modal').style.display = 'none';
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Attach event listener for task form
document.getElementById('task-form').addEventListener('submit', function (event) {
    if (editingTaskId === null) {
        addTask(event);
    } else {
        updateTask(event);
    }
});

// Fetch random joke
function fetchRandomJoke() {
    const url = 'https://v2.jokeapi.dev/joke/Any';
    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch joke');
            return response.json();
        })
        .then((jokeData) => {
            const jokeDisplay = document.getElementById('jokeDisplay');
            if (jokeData.type === 'single') {
                jokeDisplay.innerText = jokeData.joke;
            } else {
                jokeDisplay.innerText = `${jokeData.setup} - ${jokeData.delivery}`;
            }
        })
        .catch((error) => {
            console.error('Error fetching joke:', error);
            document.getElementById('jokeDisplay').innerText = 'Failed to fetch a joke.';
        });
}

// Attach event listener for joke button
document.getElementById('jokeButton').addEventListener('click', fetchRandomJoke);

// Event listeners for search, sort, and filter
document.getElementById('search-bar').addEventListener('input', renderTasks);
document.getElementById('sort-dropdown').addEventListener('change', renderTasks);
document.getElementById('filter-dropdown').addEventListener('change', renderTasks);

// Initial fetch of tasks and joke
fetchTasks();
fetchRandomJoke();