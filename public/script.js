document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const tasksContainer = document.getElementById('tasks');

    let tasks = [];

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            tasks = await response.json();
            displayTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const displayTasks = () => {
        tasksContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <span>${task.name}</span>
                <button onclick="deleteTask(${index})">Delete</button>
                <button onclick="handleTaskEdit(${index})">Edit</button>
            `;
            tasksContainer.appendChild(taskElement);
        });
    };

    const addTask = async (name) => {
        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (index) => {
        try {
            const response = await fetch(`/tasks/${index}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = async (index, newName) => {
        try {
            console.log('Editing task:', index, 'with new name:', newName);

            const response = await fetch(`/tasks/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            fetchTasks();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    window.handleTaskEdit = (index) => {
        console.log('Handling edit for index:', index);
        const task = tasks[index];
        console.log('Task to edit:', task);
        
        if (task) {
            const taskElement = document.querySelector(`#tasks .task:nth-child(${index + 1})`);
            const spanElement = taskElement.querySelector('span');
            
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = task.name;
    
            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.addEventListener('click', () => {
                const newName = inputElement.value;
                editTask(index, newName);
                inputElement.remove();
                saveButton.remove();
                spanElement.innerText = newName;
            });
    
            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.addEventListener('click', () => {
                inputElement.remove();
                saveButton.remove();
            });
    
            taskElement.appendChild(inputElement);
            taskElement.appendChild(saveButton);
            taskElement.appendChild(cancelButton);
        }
    };
    

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskName = taskNameInput.value.trim();
        if (taskName !== '') {
            await addTask(taskName);
            taskNameInput.value = '';
        }
    });

    window.deleteTask = deleteTask;

    fetchTasks();
});

