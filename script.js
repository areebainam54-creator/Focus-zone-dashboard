
const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const greetingElement = document.getElementById("greeting");


function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let period = hours >= 12 ? "PM" : "AM";

    let displayHours = hours % 12;

    if (displayHours === 0) {
        displayHours = 12;
    }

    const formattedHours = String(displayHours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    clockElement.textContent =
        `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;


    /* Greeting */

    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = "Good Morning";
    }
    else if (hours >= 12 && hours < 17) {
        greetingElement.textContent = "Good Afternoon";
    }
    else {
        greetingElement.textContent = "Good Evening";
    }


    /* Date */

    dateElement.textContent = now.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


updateClock();

setInterval(updateClock, 1000);


/* =================================
   TODO LIST
================================= */

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const taskMessage = document.getElementById("taskMessage");


let tasks = JSON.parse(localStorage.getItem("focusZoneTasks")) || [];


/* Save tasks */

function saveTasks() {
    localStorage.setItem("focusZoneTasks", JSON.stringify(tasks));
}


/* Show tasks */

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }


        /* Checkbox */

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.classList.add("task-check");
        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();
        });


        /* Task text */

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        /* Delete button */

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");

        deleteButton.innerHTML = "×";

        deleteButton.setAttribute("aria-label", "Delete task");


        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();

            renderTasks();

            showMessage("");
        });


        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });


    updateTaskControls();
}


/* Add task */

todoForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();


    if (text === "") {

        showMessage("Please enter a task.");

        return;
    }


    if (tasks.length >= 3) {

        showMessage("You can only have 3 active tasks.");

        return;
    }


    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    showMessage("");
});


/* Task limit */

function updateTaskControls() {

    taskCount.textContent = `${tasks.length} / 3`;

    if (tasks.length >= 3) {

        taskInput.disabled = true;

        todoForm.querySelector("button").disabled = true;

        taskInput.placeholder = "Maximum 3 tasks reached";

    }
    else {

        taskInput.disabled = false;

        todoForm.querySelector("button").disabled = false;

        taskInput.placeholder = "What needs to be done?";
    }
}


/* Validation message */

function showMessage(message) {

    taskMessage.textContent = message;

    if (message !== "") {

        setTimeout(function() {

            taskMessage.textContent = "";

        }, 2500);
    }
}


renderTasks();


/* =================================
   POMODORO TIMER
================================= */

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const resetButton = document.getElementById("resetBtn");
const timerStatus = document.getElementById("timerStatus");


const TOTAL_TIME = 30 * 60;

let remainingTime = TOTAL_TIME;
let timerInterval = null;


/* Display timer */

function updateTimerDisplay() {

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* Start */

startButton.addEventListener("click", function() {

    if (timerInterval !== null) {
        return;
    }


    timerStatus.textContent = "Focus mode is active.";

    timerInterval = setInterval(function() {

        if (remainingTime > 0) {

            remainingTime--;

            updateTimerDisplay();

        }
        else {

            clearInterval(timerInterval);

            timerInterval = null;

            remainingTime = TOTAL_TIME;

            updateTimerDisplay();

            timerStatus.textContent = "Time's up! Timer reset to 30:00.";
        }

    }, 1000);
});


/* Pause */

pauseButton.addEventListener("click", function() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;

        timerStatus.textContent = "Timer paused.";
    }
});


/* Reset */

resetButton.addEventListener("click", function() {

    clearInterval(timerInterval);

    timerInterval = null;

    remainingTime = TOTAL_TIME;

    updateTimerDisplay();

    timerStatus.textContent = "Ready to focus?";
});


updateTimerDisplay();