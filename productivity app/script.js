const loginFormContainer = document.getElementById("loginForm-con");
const registerFormContainer = document.getElementById("registerForm-con");
const userLoginBtn = document.querySelector(".user-login-btn")
const userLogoutBtn = document.querySelector(".user-logout-btn")
const authOverlay = document.querySelector(".auth-overlay")

const darkModeSwitchBtn = document.querySelector("#darkModeSwitch");

const greet = document.querySelector(".greet")

const currentTime = document.querySelector(".time-card__clock");
const currentDate = document.querySelector(".time-card__date");



// ************************** //
// Theme Switching function //
// ************************** //
const toggleThemeFunction = () => {
    const savedTheme = JSON.parse(localStorage.getItem("theme"));
  
    if (savedTheme) {
        document.body.classList.add("dark");
        darkModeSwitchBtn.setAttribute("aria-pressed", "true");
    } else {
        document.body.classList.remove("dark");
        darkModeSwitchBtn.setAttribute("aria-pressed", "false");
    }
  
    darkModeSwitchBtn.addEventListener("click", () => {
        let theme = JSON.parse(localStorage.getItem("theme"));
  
        if (theme) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", false);
            darkModeSwitchBtn.setAttribute("aria-pressed", "false");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", true);
            darkModeSwitchBtn.setAttribute("aria-pressed", "true");
        }
    });
};
toggleThemeFunction();








// ************************** //
// User Registration functionality //
// ************************** //
const loginForm = document.querySelector("#login-form")
const registerForm = document.querySelector("#register-form")

const fullNameInput = document.querySelector("#fullName")
const emailInput = document.querySelector("#email")
const passwordInput = document.querySelector("#password")
const confirmPasswordInput = document.querySelector("#confirmPassword")
const cityInput = document.querySelector("#city")
const countryInput = document.querySelector("#country")

const loginEmailInput = document.querySelector("#login-email")
const loginPasswordInput = document.querySelector("#login-password")
const loginBtn = document.querySelector("#login-btn")



// ********************* //// ********************* //
// Functionality to register a user ans saving into localstorage //
// ********************* //// ********************* //
registerForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
        fullName: fullNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmedPassword: confirmPasswordInput.value,

        location: {
            city: cityInput.value,
            country: countryInput.value,
        },

        todos: [],
    }

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registration Successful 🎉")
    checkAuthentication();
})




// ********************* //// ********************* //
// Functionality to check Authentication //
// ********************* //// ********************* //
function checkAuthentication () {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    // localStorage.setItem("isLoggedIn", true);

    if (users.length === 0) {
        registerFormContainer.classList.remove("hidden")
        loginFormContainer.classList.add("hidden")

        fullNameInput.value = ""
        emailInput.value = ""
        passwordInput.value = ""
        confirmPasswordInput.value = ""
        cityInput.value = ""
        countryInput.value = ""
    }
    else if (isLoggedIn) {
        registerFormContainer.classList.add("hidden")
        loginFormContainer.classList.add("hidden")

        authOverlay.classList.add("hidden")

        loginEmailInput.value = ""
        loginPasswordInput.value = ""
        authOverlay.style.display = "none";
    }
    else {
        registerFormContainer.classList.add("hidden")
        loginFormContainer.classList.remove("hidden")
    }
};




// ********************* //// ********************* //
// Functionality to login user to dashboard //
// ********************* //// ********************* //
loginBtn.addEventListener("click", (e) => { 
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find((u) => u.email === loginEmailInput.value && u.password === loginPasswordInput.value);

    if (user) {
        localStorage.setItem("isLoggedIn", true);

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login Successful")

        checkAuthentication();
        updateAuthUI();
        renderTask()
        getWeather()

        updateDashboard();

        userLoginBtn.classList.add("hidden")
        userLogoutBtn.classList.remove("hidden")
    }
    else { 
        alert("Invalid Credentials!");
    }
})


// ********************* //
// Logout Functionality //
// ********************* //
userLogoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("currentUser");

    userLoginBtn.classList.remove("hidden")
    userLogoutBtn.classList.add("hidden")
    
    checkAuthentication();
    updateAuthUI();
    updateDashboard();
})




// ********************* //// ********************* //
// Functionality ot update dashboard after login //
// ********************* //// ********************* /
function updateDashboard(){
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (!isLoggedIn) {
        document.querySelector(".user-type").textContent = "Guest";
        document.querySelector(".profile-card__name").textContent = "Guest";

        document.querySelectorAll(".user-chip__avatar").forEach(avatar=>{
            avatar.textContent = "G";
        });
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    document.querySelector(".user-type").textContent = currentUser.fullName;
    document.querySelector(".profile-card__name").textContent = currentUser.fullName;

    document.querySelectorAll(".user-chip__avatar").forEach(avatar=>{
        avatar.textContent = currentUser.fullName[0].toUpperCase();
    });
}







// ************************** //
// Show Login Form Logic //
// ************************** //
userLoginBtn.addEventListener("click", () => {
    authOverlay.style.display = "flex"

    registerFormContainer.classList.add("hidden")
    loginFormContainer.classList.remove("hidden")

    loginEmailInput.value = "";
    loginPasswordInput.value = "";
})



document.getElementById("showRegister").onclick = (e)=>{
    e.preventDefault();
    loginFormContainer.classList.add("hidden");
    registerFormContainer.classList.remove("hidden");
}

document.getElementById("showLogin").onclick = (e)=>{
    e.preventDefault();
    registerFormContainer.classList.add("hidden");
    loginFormContainer.classList.remove("hidden");
}

document.querySelectorAll(".auth-form-close-btn").forEach(btn=>{
    btn.onclick=()=>{
        document.getElementById("authOverlay").style.display="none";
    }
});








// ************************** //
// Greeting the user depending upon time 
// ************************** //

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        greet.textContent = "Good Morning";
    }
    else if (hour < 17) {
        greet.textContent = "Good Afternoon";
    }
    else if (hour < 21) {
        greet.textContent = "Good Evening";
    }
    else {
        greet.textContent = "Good Night";
    }
}
getGreeting();





// ************************** //
// Functionality to show the live time and date in dashboard
// ************************** //
function updateClock() {
    const now = new Date();

    // Time
    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // false for 24-hour format
    });

    // Date
    const date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    currentTime.textContent = time;
    currentDate.textContent = date;
}

updateClock();    
setInterval(updateClock, 1000); // setInterval Update the time every second 






// ************************** //// ************************** //
// Functionality to show the live weather information in dashboard
// ************************** //// ************************** //
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const API_KEY = "5753ec8d34e2ef7e6319af2cd5855e05";

async function getWeather() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    const city = currentUser.location.city;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        updateWeatherCard(data);
    } catch (error) {
        console.log(error);
    }
}

function updateWeatherCard(data){
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weatherDescription").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent =`${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${data.wind.speed} km/h`;
    document.getElementById("rain").textContent = data.rain ? `${data.rain["1h"] || 0} mm` : "0 mm";
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}







// ************************** //// ************************** //
// Functionality to show the motivational quote in dashboard
// ************************** //// ************************** //
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");


const quotes = [
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    text: "Small progress is still progress.",
    author: "Anonymous"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki"
  },
  {
    text: "Dream big. Start small. Act now.",
    author: "Robin Sharma"
  },
  {
    text: "Consistency beats intensity when intensity is inconsistent.",
    author: "Anonymous"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  }
];


const QUOTE_API_KEY = "m0ZKJXpziXxuvDWoq7snEcetL9otxdsEKkkCBlFJ";

// Display Quote
function displayQuote(quote, author) {
    quoteText.textContent = `"${quote}"`;
    quoteAuthor.textContent = `— ${author}`;
}

// Random Local Quote
function getRandomLocalQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

// Save Quote
function saveQuote(quote, author) {
    localStorage.setItem("dailyQuote", quote);
    localStorage.setItem("dailyAuthor", author);
    localStorage.setItem("dailyQuoteDate", new Date().toDateString());
}

// Fetch Quote
async function fetchQuote() {
    quoteText.textContent = "Loading...";
    quoteAuthor.textContent = "";

    try {

        // Try API 5 times
        for (let i = 0; i < 3; i++) {
            const response = await fetch(
                "https://api.api-ninjas.com/v1/quotes",
                {
                    headers: { "X-Api-Key": QUOTE_API_KEY }
                }
            );

            if (!response.ok) {
                throw new Error("API Error");
            }

            const data = await response.json();

            const quote = data[0].quote;
            const author = data[0].author;

            const wordCount = quote.trim().split(/\s+/).length;

            // Only show 20–25 word quotes
            if (wordCount <= 20) {
                displayQuote(quote, author);
                saveQuote(quote, author);
                return;
            }
        }

        // API worked but didn't return a suitable quote
        throw new Error("No suitable quote");

    } catch (error) {
        console.log("Using local quotes:", error.message);
        const localQuote = getRandomLocalQuote();
        displayQuote(localQuote.text, localQuote.author);
        saveQuote(localQuote.text, localQuote.author);
    }
}

// Load Today's Quote
function loadDailyQuote() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("dailyQuoteDate");

    if (savedDate === today) {
        displayQuote(
            localStorage.getItem("dailyQuote"),
            localStorage.getItem("dailyAuthor")
        );
    } else {
        fetchQuote();
    }
}

// New Quote Button
newQuoteBtn.addEventListener("click", fetchQuote);

// Initial Load
loadDailyQuote();






// ********************************************************************************* //
// Updating the authentication ui preventing refresh logout /Login buttons on topbar
// ********************************************************************************* //
function updateAuthUI() {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

    if (isLoggedIn) {
        userLoginBtn.classList.add("hidden");
        userLogoutBtn.classList.remove("hidden");
    } else {
        userLoginBtn.classList.remove("hidden");
        userLogoutBtn.classList.add("hidden");
    }
}






// ***************************************** // 
// Functionality to show the different pages //
// ***************************************** //
const pages = {
    dashboard: document.querySelector("#dashboard-page"),
    todo: document.querySelector(".todo-page"),
    planner: document.querySelector(".planner-page"),
    goals: document.querySelector(".goals-page"),
    pomodoro: document.querySelector(".pomodoro-page"),
    weather: document.querySelector(".weather-page"),
    motivation: document.querySelector(".motivation-page")
};
const navButtons = {
    dashboard: document.querySelector("#dashboard-btn"),
    todo: document.querySelector("#todo-btn"),
    planner: document.querySelector("#planner-btn"),
    goals: document.querySelector("#goals-btn"),
    pomodoro: document.querySelector("#pomodoro-btn"),
    weather: document.querySelector("#weather-btn"),
    motivation: document.querySelector("#motivation-btn")
};

function showPage(page) {
    Object.values(pages).forEach(section => {
        if(section) section.classList.add("hidden");
    });

    Object.values(navButtons).forEach(btn => {
        if(btn) btn.classList.remove("nav__item--active");
    });

    pages[page]?.classList.remove("hidden");

    navButtons[page]?.classList.add("nav__item--active");
    localStorage.setItem("activePage", page);
}

document.querySelectorAll("[data-page]").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(item.dataset.page);
    });
});

showPage(localStorage.getItem("activePage") || "dashboard");






// ************************* //
// Adding Task Functionality // 
// ************************* //
const addTaskBtn = document.querySelector(".add-task-btn")
const closeTaskForm = document.querySelector(".task-form-close-btn")
const taskModal = document.querySelector("#taskModal");
const addTaskForm = document.querySelector("#addTaskForm")

const taskTitleInp = document.querySelector("#taskTitle")
const taskCategoryInp = document.querySelector("#taskCategory")
const taskStatusInp = document.querySelector("#taskStatus")
const taskDateInp = document.querySelector("#taskDate")
const taskTimeInp = document.querySelector("#taskTime")

const tasksContainer = document.querySelector(".tasks-container")

const cancelTask = document.querySelector("#cancelTask")

const totalTasks = document.querySelector("#total-tasks")
const completedTasks = document.querySelector("#completed-tasks")
const inProgressTasks = document.querySelector("#progress-tasks")
const pendingTasks = document.querySelector("#pending-tasks")


const showAllTasks = document.querySelector(".show-all-tasks-btn")
const showPendingTasks = document.querySelector(".show-pending-tasks-btn")
const showInProgressTasks = document.querySelector(".show-inProgress-tasks-btn")
const showCompletedTasks = document.querySelector(".show-completed-tasks-btn")


let editTaskId = null;


addTaskBtn.addEventListener("click", () => {
    editTaskId = null;      
    addTaskForm.reset();
    taskModal.classList.remove("hidden");
});

closeTaskForm.addEventListener("click", ()=>{
    editTaskId = null;
    addTaskForm.reset();
    taskModal.classList.add("hidden");
});

cancelTask.addEventListener("click", ()=>{
    editTaskId = null;
    addTaskForm.reset();
    taskModal.classList.add("hidden");
});


// This function is updating the stats of tasks like totalTasks, pendingtask...
function updateTaskStats(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    
    totalTasks.textContent = currentUser.todos.length;
    completedTasks.textContent = currentUser.todos.filter(todo=>todo.status==="Completed").length;
    pendingTasks.textContent = currentUser.todos.filter(todo=>todo.status==="Pending").length;
    inProgressTasks.textContent = currentUser.todos.filter(todo=>todo.status==="in-progress").length;
}



// formatTaskDate function will formate the date compare the date of todo creation date and give the today, tomorrow and yesterday accordingly
function formatTaskDate(taskDate) {
    const today = new Date();
    const date = new Date(taskDate);

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diff = (date - today) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
        return "Today";
    }

    if (diff === 1) {
        return "Tomorrow";
    }

    if (diff === -1) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// function render task is rendering every task after creation and after login 
function renderTask(tasks = null) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    const todos = currentUser.todos;

    updateTaskStats();

    if (!tasks) tasks = todos;

    tasksContainer.innerHTML = "";

    tasks.forEach(todo => {

        const todoDate = formatTaskDate(todo.date);

        tasksContainer.innerHTML += `
        <div class="task-row ${todo.status === "Completed" ? "completed" : ""}">

            <div class="task-left">

                <input
                    type="checkbox"
                    ${todo.status === "Completed" ? "checked" : ""}
                    onchange="toggleTaskStatus(${todo.id})">

                <span class="task-title">${todo.title}</span>

                <span class="badge ${todo.category.toLowerCase()}">
                    ${todo.category}
                </span>

            </div>

            <div class="task-right">

                <span>
                    <i class="ri-calendar-line"></i>
                    ${todoDate}, ${todo.time}
                </span>

                <button onclick="editTask(${todo.id})">
                    <i class="ri-edit-line"></i>
                </button>

                <button onclick="deleteTask(${todo.id})">
                    <i class="ri-delete-bin-6-line"></i>
                </button>

            </div>

        </div>
        `;
    });
}


// This functionality is for completing the task // 
function toggleTaskStatus(id){

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const todo = currentUser.todos.find(todo => todo.id == id);

    if(!todo) return;

    todo.status =
        todo.status === "Completed"
        ? "Pending"
        : "Completed";

    saveUser(currentUser);

    renderTask();
}

// This function is to edit a task 
function editTask(id){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const todo = currentUser.todos.find(todo => todo.id == id);

    if(!todo) return;

    editTaskId = id;

    taskTitleInp.value = todo.title;
    taskCategoryInp.value = todo.category;
    taskStatusInp.value = todo.status;
    taskDateInp.value = todo.date;
    taskTimeInp.value = todo.time;

    taskModal.classList.remove("hidden");
}

// This function is to delete a task 
function deleteTask(id){
    if (!confirm("Delete this task?")) return;
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.todos = currentUser.todos.filter(todo => todo.id != id);
    saveUser(currentUser);
    renderTask();
}



// Function to filter tasks according to the status of the task 
function filterTasks(status) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    if (status === "All") {
        renderTask(currentUser.todos);
        return;
    }

    const filtered = currentUser.todos.filter(
        todo => todo.status === status
    );

    renderTask(filtered);
}


// This function is saving the users // 
function saveUser(currentUser){
    localStorage.setItem( "currentUser", JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem("users"));
    const index = users.findIndex( user => user.email === currentUser.email );

    users[index] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    renderTask();
}


// Functionality to apply active class and showing the tasks according to status 
const tabButtons = document.querySelectorAll(".todo-tabs button");

function setActiveTab(button){
    tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

showAllTasks.addEventListener("click", () => {
    setActiveTab(showAllTasks);
    filterTasks("All");
});

showPendingTasks.addEventListener("click", () => {
    setActiveTab(showPendingTasks);
    filterTasks("Pending");
});

showInProgressTasks.addEventListener("click", () => {
    setActiveTab(showInProgressTasks);
    filterTasks("in-progress");
});

showCompletedTasks.addEventListener("click", () => {
    setActiveTab(showCompletedTasks);
    filterTasks("Completed");
});





// This functionality is adding the task and updating the user object
addTaskForm.addEventListener("submit", function(e){

    e.preventDefault();

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if(editTaskId !== null){

        const todo =
            currentUser.todos.find(todo=>todo.id===editTaskId);

        if(todo){

            todo.title = taskTitleInp.value;
            todo.category = taskCategoryInp.value;
            todo.status = taskStatusInp.value;
            todo.date = taskDateInp.value;
            todo.time = taskTimeInp.value;

        }

    }else{

        currentUser.todos.push({

            id: Date.now(),

            title: taskTitleInp.value,

            category: taskCategoryInp.value,

            status: taskStatusInp.value,

            date: taskDateInp.value,

            time: taskTimeInp.value

        });

    }

    saveUser(currentUser);

    editTaskId = null;

    addTaskForm.reset();

    taskModal.classList.add("hidden");

    renderTask();

});










// ********************* //// ********************* //
// Preventing the user after refresh //
// ********************* //// ********************* //
checkAuthentication()

if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
    updateDashboard();
    updateAuthUI();
    renderTask();
    getWeather();
}