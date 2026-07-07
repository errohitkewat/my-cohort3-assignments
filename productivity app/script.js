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
// ********************* //// ********************* //


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
const todoPage = document.querySelector(".todo-page")
const todoBtn = document.querySelector("#todo-btn")
const dashboardBtn = document.querySelector("#dashboard-btn")
const dashboardPage = document.querySelector("#dashboard-page")

function showPage(page) {

    if (page === "dashboard") {
        dashboardPage.classList.remove("hidden");
        todoPage.classList.add("hidden");
        dashboardBtn.classList.add("nav__item--active")
        todoBtn.classList.remove("nav__item--active")
    }

    if (page === "todo") {
        todoPage.classList.remove("hidden");
        dashboardPage.classList.add("hidden");
        dashboardBtn.classList.remove("nav__item--active")
        todoBtn.classList.add("nav__item--active")
    }

    localStorage.setItem("activePage", page);
}


dashboardBtn.addEventListener("click", () => {
    showPage("dashboard");
});

todoBtn.addEventListener("click", () => {
    showPage("todo");
});


const activePage = localStorage.getItem("activePage") || "dashboard";

showPage(activePage);










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


addTaskBtn.addEventListener("click", () => { 
    taskModal.classList.remove("hidden")
})

closeTaskForm.addEventListener("click", () => { 
    taskModal.classList.add("hidden")
})

cancelTask.addEventListener("click", () => {
    taskModal.classList.add("hidden");
});


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

    // Statistics
    totalTasks.textContent = todos.length;
    completedTasks.textContent = todos.filter(todo => todo.status === "Completed").length;
    pendingTasks.textContent = todos.filter(todo => todo.status === "Pending").length;
    inProgressTasks.textContent = todos.filter(todo => todo.status === "In Progress").length;

    // If no filtered tasks are passed, show all
    if (!tasks) tasks = todos;

    tasksContainer.innerHTML = "";

    tasks.forEach((todo) => {
        const todoDate = formatTaskDate(todo.date);

        tasksContainer.innerHTML += `
        <div class="task-row">
            <div class="task-left">
                <input type="checkbox">
                <span class="task-title">${todo.title}</span>
                <span class="badge ${todo.category.toLowerCase()}">${todo.category}</span>
            </div>

            <div class="task-right">
                <span>
                    <i class="ri-calendar-line"></i>
                    ${todoDate}, ${todo.time}
                </span>

                <button>
                    <i class="ri-more-2-fill"></i>
                </button>
            </div>
        </div>`;
    });
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
    filterTasks("In Progress");
});

showCompletedTasks.addEventListener("click", () => {
    setActiveTab(showCompletedTasks);
    filterTasks("Completed");
});





// This functionality is adding the task and updating the user object
addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const newTodo = {
        title: taskTitleInp.value,
        category: taskCategoryInp.value,
        status: taskStatusInp.value,
        date: taskDateInp.value,
        time: taskTimeInp.value,
    };

    currentUser.todos.push(newTodo);

    localStorage.setItem( "currentUser", JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem("users"));

    const index = users.findIndex( user => user.email === currentUser.email );

    users[index] = currentUser;

    localStorage.setItem( "users", JSON.stringify(users));

    renderTask();

    addTaskForm.reset();

    taskModal.classList.add("hidden");
});



showPendingTasks.addEventListener("click", () => { 
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    const todos = currentUser.todos;
    const pending = todos.filter(todo => todo.status === "Pending")
    console.log(pending);



})









// ********************* //// ********************* //
// Preventing the user after refresh //
// ********************* //// ********************* //
checkAuthentication()
renderTask();

if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
    updateDashboard();
    updateAuthUI();
}