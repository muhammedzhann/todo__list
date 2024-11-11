const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const addItemButton = document.getElementById('add-item');
const statusMessage = document.createElement('p');
taskList.insertAdjacentElement('beforebegin', statusMessage);

async function loadTasks() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const tasks = await response.json();
        statusMessage.textContent = 'Tasks loaded successfully';
        taskList.innerHTML = '';
        tasks.slice(0, 5).forEach(addTaskToDOM);
    } catch {
        statusMessage.textContent = 'Failed to load tasks';
    }
}

function addTaskToDOM(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <h4 class="${task.completed ? 'completed' : ''}">${task.title}</h4>
        <div class="icons">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(this)">
            <i class="fa-solid fa-trash" onclick="deleteTask(this)"></i>
        </div>
    `;
    taskList.appendChild(taskItem);
}

addItemButton.addEventListener('click', async () => {
    const title = newTaskInput.value.trim();
    if (title === '') {
        statusMessage.textContent = 'Task cannot be empty';
        return;
    }
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, completed: false })
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        newTaskInput.value = '';
        statusMessage.textContent = 'Task added successfully';
    } catch {
        statusMessage.textContent = 'Failed to add task';
    }
});

function toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const taskText = taskItem.querySelector('h4');
    taskText.classList.toggle('completed');
}


async function deleteTask(deleteIcon) {
    try {
        deleteIcon.closest('.task-item').remove();
        statusMessage.textContent = 'Task deleted successfully';
    } catch {
        statusMessage.textContent = 'Failed to delete task';
    }
}

window.addEventListener('DOMContentLoaded', loadTasks);
