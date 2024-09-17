function addTask() {
    var taskInput = document.getElementById('taskInput');
    var priorityInput = document.getElementById('priorityInput');
    var dueDateInput = document.getElementById('dueDateInput');
    var taskList = document.getElementById('taskList');
    var task = taskInput.value;
    var priority = priorityInput.value;
    var dueDate = dueDateInput.value;

    if (task) {
        var li = document.createElement('li');
        li.className = 'priority-' + priority;
        li.innerHTML = `<span>${task} (Due: ${dueDate})</span>`;

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = function() {
            editTask(li);
        };

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            taskList.removeChild(li);
            saveTasks();
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
        taskInput.value = '';
        dueDateInput.value = '';
        saveTasks();
    }
}

function editTask(li) {
    var taskDetails = li.firstChild.textContent.split(' (Due: ');
    var task = taskDetails[0];
    var dueDate = taskDetails[1].slice(0, -1);

    var newTask = prompt('Edit your task:', task);
    var newDueDate = prompt('Edit due date (YYYY-MM-DD):', dueDate);

    if (newTask && newDueDate) {
        li.firstChild.textContent = `${newTask} (Due: ${newDueDate})`;
        saveTasks();
    }
}

function saveTasks() {
    var tasks = [];
    var taskList = document.getElementById('taskList').children;
    for (var i = 0; i < taskList.length; i++) {
        var taskText = taskList[i].firstChild.textContent;
        var priorityClass = taskList[i].className;
        tasks.push({ text: taskText, priority: priorityClass });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement('li');
            li.className = tasks[i].priority;
            li.innerHTML = `<span>${tasks[i].text}</span>`;

            var buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            var editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.onclick = function() {
                editTask(li);
            };

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                taskList.removeChild(li);
                saveTasks();
            };

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            li.appendChild(buttonContainer);
            document.getElementById('taskList').appendChild(li);
        }
    }
}

function backupTasks() {
    var tasks = localStorage.getItem('tasks');
    var blob = new Blob([tasks], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importTasks(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var tasks = JSON.parse(e.target.result);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.getElementById('taskList').innerHTML = '';
        loadTasks();
    };
    reader.readAsText(file);
}

function filterTasks() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var taskList = document.getElementById('taskList').children;
    for (var i = 0; i < taskList.length; i++) {
        var taskText = taskList[i].firstChild.textContent.toLowerCase();
        if (taskText.includes(searchInput)) {
            taskList[i].style.display = '';
        } else {
            taskList[i].style.display = 'none';
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

window.onload = loadTasks;