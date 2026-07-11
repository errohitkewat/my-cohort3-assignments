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
        planner: [],
        dailyGoals: [],
        pomodoro:{
            mode:"focus",
            timeLeft:1500,
            sessionCount:0,
            isRunning:false
        }
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
        renderPlanner();
        getWeather()

        updateDashboard();
        updateDashboardStats();

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
    updateDashboardStats();
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
const weatherForm = document.getElementById("weatherSearchForm");
const API_KEY = "5753ec8d34e2ef7e6319af2cd5855e05";

function getWeather() {

    if (loadCachedWeather()) return;

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    // User already selected a city before
    if (
        currentUser.location?.lat &&
        currentUser.location?.lon
    ) {

        getWeatherByCoords(
            currentUser.location.lat,
            currentUser.location.lon
        );

        return;
    }

    // Try GPS
    requestUserLocation();

}


async function requestUserLocation() {

    if (!navigator.geolocation) {

        fallbackToSavedCity();

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const { latitude, longitude } =
                position.coords;

            const data =
                await getWeatherByCoords(latitude, longitude);

            if (!data) {

                fallbackToSavedCity();

                return;

            }

            let currentUser =
                JSON.parse(localStorage.getItem("currentUser"));

            currentUser.location = {

                city: data.name,

                country: data.sys.country,

                lat: latitude,

                lon: longitude

            };

            saveUser(currentUser);

        },

        () => {

            // GPS failed
            fallbackToSavedCity();

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}

async function fallbackToSavedCity() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) return;

    const city = currentUser.location?.city;

    const country = currentUser.location?.country;

    if (city) {

        getWeatherBySearch(city, country);

        return;

    }

    alert("Search a city to view weather.");

}















// ********************* //
// Weather Page Code // 
// ********************* //

async function getWeatherByCoords(lat, lon) {

    try {

        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`

        );

        const data = await response.json();

        if (data.cod != 200) {

            return null;

        }

        updateWeatherCard(data);

        saveWeatherCache(data);

        return data;

    }

    catch (err) {

        console.log(err);

        return null;

    }

}

async function getWeatherBySearch(city, country = "") {

    try {

        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${API_KEY}`

        );

        const data = await response.json();

        if (data.cod != 200) {

            alert("City not found.");

            return;

        }

        updateWeatherCard(data);

        saveWeatherCache(data);

        updateUserLocation(

            data.name,

            data.sys.country,

            data.coord.lat,

            data.coord.lon

        );

        document.getElementById("weatherCity").value = "";

        document.getElementById("weatherCountry").value = "";

    }

    catch (err) {

        console.log(err);

    }

}

function saveWeatherCache(data){

    localStorage.setItem(
        "weatherCache",
        JSON.stringify({
            data,
            time: Date.now()
        })
    );

}

function loadCachedWeather(){

    const cache =
        JSON.parse(localStorage.getItem("weatherCache"));

    if(!cache) return false;

    const thirtyMinutes =
        30 * 60 * 1000;

    if(Date.now() - cache.time < thirtyMinutes){

        updateWeatherCard(cache.data);

        return true;

    }

    return false;

}

const weatherBackgrounds = {
    Clear: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=1600",
    Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600",
    Rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600",
    Drizzle: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1600",
    Thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600",
    Snow: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1600",
    Mist: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1600",
    Fog: "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600",
    Haze: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1600",
    Smoke: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1600",
    Default: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1600"
};

weatherForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = document.getElementById("weatherCity").value.trim();
    const country = document.getElementById("weatherCountry").value.trim();

    if (city === "") {
        alert("Please enter city");
        return;
    }
    getWeatherBySearch(city, country);
});

function updateUserLocation(city, country, lat, lon) {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    currentUser.location = {

        city,

        country,

        lat,

        lon

    };

    saveUser(currentUser);

}

function updateWeatherCard(data) {
    const heroCard = document.querySelector(".weather-hero");
    const weather = data.weather[0].main;
    
    heroCard.style.backgroundImage = `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${weatherBackgrounds[weather] || weatherBackgrounds.Default})`;
    
    heroCard.style.backgroundSize = "cover";
    heroCard.style.backgroundPosition = "center";
    heroCard.style.backgroundRepeat = "no-repeat";

    /* Dashboard Card */

    document.getElementById("cityName").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("weatherDescription").textContent =
        data.weather[0].description;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("windSpeed").textContent =
        `${data.wind.speed} km/h`;

    document.getElementById("rain").textContent =
        data.rain ? `${data.rain["1h"] || 0} mm` : "0 mm";

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;



    /* Weather Page */

    document.getElementById("weatherHeroTemp").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("weatherHeroCondition").textContent =
        data.weather[0].description;

    document.getElementById("weatherHeroLocation").textContent =
        `📍 ${data.name}, ${data.sys.country}`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("weatherHumidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("weatherWind").textContent =
        `${data.wind.speed} km/h`;

    document.getElementById("weatherPressure").textContent =
        `${data.main.pressure} hPa`;

    document.getElementById("weatherHeroImage").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

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
    promodoro: document.querySelector(".promodoro-page"),
    weather: document.querySelector(".weather-page"),
    motivation: document.querySelector(".motivation-page")
};

const navButtons = {
    dashboard: document.querySelector("#dashboard-btn"),
    todo: document.querySelector("#todo-btn"),
    planner: document.querySelector("#planner-btn"),
    goals: document.querySelector("#goals-btn"),
    promodoro: document.querySelector("#promodoro-btn"),
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
    completedTasks.textContent = currentUser.todos.filter(todo=>todo.status==="completed").length;
    pendingTasks.textContent = currentUser.todos.filter(todo=>todo.status==="pending").length;
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
    updateDashboardStats();

    if (!tasks) tasks = todos;

    tasksContainer.innerHTML = "";

    tasks.forEach(todo => {

        const todoDate = formatTaskDate(todo.date);

        tasksContainer.innerHTML += `
        <div class="task-row ${todo.status === "completed" ? "completed" : ""}">

            <div class="task-left">

                <input
                    type="checkbox"
                    ${todo.status === "completed" ? "checked" : ""}
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
        todo.status === "completed"
        ? "pending"
        : "completed";

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

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        user => user.email === currentUser.email
    );

    if(index !== -1){

        users[index] = currentUser;

        localStorage.setItem("users", JSON.stringify(users));

    }

}




// Function to update dashboard status //
function updateDashboardStats() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        document.getElementById("dashboard-total-tasks").textContent = 0;
        document.getElementById("dashboard-completed-tasks").textContent = 0;
        document.getElementById("dashboard-focus-time").textContent = "0 min";

        return;
    }

    // Total Tasks
    const total = currentUser.todos.length;

    // Completed Tasks
    const completed = currentUser.todos.filter(
        task => task.status === "completed"
    ).length;

    // Focus Time
    let focusMinutes = 0;

    if (currentUser.pomodoro) {

        const sessions = currentUser.pomodoro.sessionCount || 0;

        focusMinutes = sessions * 25;
    }

    document.getElementById("dashboard-total-tasks").textContent = total;

    document.getElementById("dashboard-completed-tasks").textContent = completed;

    document.getElementById("dashboard-focus-time").textContent =
        `${focusMinutes} min`;
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
















// ******************** //
// Daily Planer Code // 
// ******************** //
const plannerList = document.getElementById("plannerList");
const plannerTime = document.getElementById("plannerTime");
const plannerText = document.getElementById("plannerText");
const addPlannerBtn = document.getElementById("addPlannerBtn");
const clearPlanner = document.getElementById("clearPlanner");
const plannerDate = document.getElementById("plannerDate");

plannerDate.textContent = new Date().toLocaleDateString("en-IN",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
});


function renderPlanner() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  plannerList.innerHTML = "";

  currentUser.planner.forEach((plan) => {
    plannerList.innerHTML += `<div class="planner-item ${plan.completed ? "completed" : ""}">
            <div class="planner-left">
                <input
                    type="checkbox"
                    ${plan.completed ? "checked" : ""}
                    onchange="togglePlan(${plan.id})"
                >
                <div class="plan-time">
                    ${plan.time}
                </div>
                <div class="plan-text">
                    ${plan.text}
                </div>
            </div>
        
            <div class="planner-right">
                <button onclick="deletePlan(${plan.id})" class="delete-plan">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </div>`;
  });
}


addPlannerBtn.addEventListener("click", () => {
  if (plannerTime.value === "" || plannerText.value.trim() === "") {
    return alert("Fill all fields");
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  currentUser.planner.push({
    id: Date.now(),

    time: plannerTime.value,

    text: plannerText.value,

    completed: false,
  });

  saveUser(currentUser);

  plannerTime.value = "";
  plannerText.value = "";

  renderPlanner();
});

function togglePlan(id) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const plan = currentUser.planner.find((p) => p.id === id);

  if (!plan) return;

  plan.completed = !plan.completed;

  saveUser(currentUser);

  renderPlanner();
}

function deletePlan(id) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  currentUser.planner = currentUser.planner.filter((p) => p.id !== id);

  saveUser(currentUser);

  renderPlanner();
}


clearPlanner.addEventListener("click", () => {
  if (!confirm("Clear all plans?")) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  currentUser.planner = [];

  saveUser(currentUser);

  renderPlanner();
});













/* =====================================
        POMODORO TIMER
===================================== */

const timerElement = document.getElementById("timer");
const modeName = document.getElementById("modeName");
const sessionCount = document.getElementById("sessionCount");

const progressCircle = document.getElementById("progressCircle");

const startBtn = document.getElementById("startTimer");
const pauseBtn = document.getElementById("pauseTimer");
const resetBtn = document.getElementById("resetTimer");

const modeButtons = document.querySelectorAll(".mode-btn");

const RADIUS = 135;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

progressCircle.style.strokeDasharray = CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = 0;

const timerModes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

let timerInterval = null;



function initializePomodoro(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if(!currentUser) return;

    if(!currentUser.pomodoro){
        currentUser.pomodoro = {
            mode:"focus",
            timeLeft:timerModes.focus,
            totalTime:timerModes.focus,
            sessionCount:0,
            isRunning:false
        };

        saveUser(currentUser);
    }
}

function getPomodoro(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser.pomodoro;
}

function timerFinished() {
    const pomodoro = getPomodoro();
    pomodoro.isRunning = false;

    if (pomodoro.mode === "focus") {
        pomodoro.sessionCount++;
    }

    if (pomodoro.mode === "focus") {
        if (pomodoro.sessionCount % 4 === 0) {
            pomodoro.mode = "long";
        } else {
            pomodoro.mode = "short";
        }
    } else {
        pomodoro.mode = "focus";
    }

    pomodoro.timeLeft = timerModes[pomodoro.mode];
    pomodoro.totalTime = timerModes[pomodoro.mode];

    savePomodoro(pomodoro);

    updatePomodoroUI();
    updateDashboardStats();

    startBtn.disabled = false;
    startBtn.innerHTML = `<i class="ri-play-fill"></i>Start`;

    // Browser notification
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("Pomodoro Timer", {
                body: pomodoro.mode === "focus" ? "Break time! " : "Focus time! "
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }

    // Simple sound
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

    audio.play().catch(() => { });

    alert(
        pomodoro.mode === "focus" ? "Break Time!" : "Focus Time!"
    );
}

function savePomodoro(data){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.pomodoro = data;
    saveUser(currentUser);
}


function updateModeButtons(mode){
    modeButtons.forEach(btn=>{
        btn.classList.toggle( "active", btn.dataset.mode === mode);
    });
}


function updatePomodoroUI(){
    const pomodoro = getPomodoro();
    const minutes = String(Math.floor(pomodoro.timeLeft/60)).padStart(2,"0");
    const seconds = String(pomodoro.timeLeft%60).padStart(2,"0");
    timerElement.textContent =`${minutes}:${seconds}`;
    sessionCount.textContent = pomodoro.sessionCount;
    modeName.textContent = pomodoro.mode === "focus" ? "Focus Time" : pomodoro.mode==="short" ? "Short Break" : "Long Break";
    updateModeButtons(pomodoro.mode);
    const progress = pomodoro.timeLeft/pomodoro.totalTime;
    progressCircle.style.strokeDashoffset = CIRCUMFERENCE - (progress*CIRCUMFERENCE);
}



function startPomodoro(){
    const pomodoro = getPomodoro();
    if (pomodoro.isRunning) return;
    
    pomodoro.isRunning = true;
    savePomodoro(pomodoro);
    startBtn.innerHTML = `<i class="ri-loader-4-line"></i>Running`;
    startBtn.disabled = true;

    timerInterval = setInterval(() => {
        const data = getPomodoro();

        if(data.timeLeft > 0){
            data.timeLeft--;
            savePomodoro(data);
            updatePomodoroUI();
        }else{
            clearInterval(timerInterval);
            timerFinished();
        }
    },1000);
}

function pausePomodoro(){
    clearInterval(timerInterval);
    const pomodoro = getPomodoro();
    pomodoro.isRunning = false;
    savePomodoro(pomodoro);
    startBtn.disabled = false;
    startBtn.innerHTML = `<i class="ri-play-fill"></i>Resume`;
}

function resetPomodoro(){
    clearInterval(timerInterval);
    const pomodoro = getPomodoro();
    pomodoro.isRunning = false;
    pomodoro.timeLeft = timerModes[pomodoro.mode];
    pomodoro.totalTime = timerModes[pomodoro.mode];
    savePomodoro(pomodoro);
    startBtn.disabled = false;
    startBtn.innerHTML = `<i class="ri-play-fill"></i>Start`;

    updatePomodoroUI();
}

startBtn.addEventListener("click", startPomodoro);
pauseBtn.addEventListener("click", pausePomodoro);
resetBtn.addEventListener("click", resetPomodoro);


function changeMode(mode){
    clearInterval(timerInterval);

    const pomodoro = getPomodoro();
    pomodoro.mode = mode;
    pomodoro.timeLeft = timerModes[mode];
    pomodoro.totalTime = timerModes[mode];
    pomodoro.isRunning = false;

    savePomodoro(pomodoro);

    startBtn.disabled = false;
    startBtn.innerHTML = `<i class="ri-play-fill"></i>Start`;

    updatePomodoroUI();
}












/* ==========================================
        DAILY GOALS
========================================== */
const goalsContainer = document.getElementById("goalsContainer");
const goalForm = document.getElementById("goalForm");
const goalModal = document.getElementById("goalModal");
const openGoalModal = document.getElementById("openGoalModal");
const closeGoalModal = document.getElementById("closeGoalModal");
const cancelGoal = document.getElementById("cancelGoal");
const goalProgressFill = document.getElementById("goalProgressFill");
const goalProgressText = document.getElementById("goalProgressText");
const goalPercent = document.getElementById("goalPercent");
const resetGoalsBtn = document.getElementById("resetGoalsBtn");
const dashboardDailyGoals = document.getElementById("dashboard-daily-goals");
const dashboardDailyGoalsHint = document.querySelector("#dashboard-daily-goals").parentElement.querySelector(".stat-card__hint");
const today = new Date().toDateString();
const savedDate = localStorage.getItem("goalDate");

if(savedDate !== today){
    localStorage.removeItem("dailyGoals");
    localStorage.setItem("goalDate",today);
}

let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];







/* ==========================================
Render Goals
========================================== */
function renderGoals(){
    goalsContainer.innerHTML = "";

    if(goals.length === 0){
        goalsContainer.innerHTML = ` <div class="empty-goals">
                <i class="ri-checkbox-circle-line"></i>
                <h3>No Daily Goals</h3>
                <p>Click "Add Goal" to create your first goal.</p>
            </div>`;

        updateProgress();
        return;
    }

    goals.forEach((goal,index) => {
        const goalCard = document.createElement("div");
        goalCard.className = `goal-row ${goal.completed ? "completed" : ""}`;

        goalCard.innerHTML = ` <div class="goal-left">
                <input
                    type="checkbox"
                    class="goal-checkbox"
                    ${goal.completed ? "checked" : ""}
                    data-index="${index}"
                >
                <div>
                    <h4>${goal.title}</h4>
                    <small>
                        ${goal.category}
                        •
                        ${goal.priority}
                        ${goal.time ? "• " + goal.time : ""}
                    </small>
                </div>
            </div>

            <div class="goal-actions">
                <button
                    class="delete-goal"
                    data-index="${index}">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>`;
        goalsContainer.appendChild(goalCard);
    });
    updateProgress();
}


openGoalModal.addEventListener("click",()=>{
    goalModal.classList.remove("hidden");
});

closeGoalModal.addEventListener("click",()=>{
    goalModal.classList.add("hidden");
});

cancelGoal.addEventListener("click",()=>{
    goalModal.classList.add("hidden");
});

goalModal.addEventListener("click",(e)=>{
    if(e.target===goalModal){
        goalModal.classList.add("hidden");
    }
});


goalsContainer.addEventListener("click",(e)=>{
    if(e.target.closest(".delete-goal")){
        const index = e.target.closest(".delete-goal").dataset.index;
        goals.splice(index,1);

        renderGoals();
    }
});

goalsContainer.addEventListener("change",(e)=>{
    if(e.target.classList.contains("goal-checkbox")){
        const index = e.target.dataset.index;
        goals[index].completed =
        e.target.checked;
        renderGoals();
    }
});


//  Reset
resetGoalsBtn.addEventListener("click",()=>{
    goals.forEach(goal=>{
        goal.completed=false;
    });
    renderGoals();
});

renderGoals();



function updateProgress(){
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    /* Daily Goals Page */
    goalProgressFill.style.width = percent + "%";

    goalProgressText.textContent = `${completed} / ${total} Goals Completed`;

    goalPercent.textContent = percent + "%";

    /* Dashboard Card */

    if(dashboardDailyGoals){
        dashboardDailyGoals.textContent = `${completed}/${total}`;
    }

    if(dashboardDailyGoalsHint){
        if(total===0){
            dashboardDailyGoalsHint.textContent = "No Goals";
        }

        else if(completed===0){
            dashboardDailyGoalsHint.textContent = "Not Started";
        }

        else if(completed===total){
            dashboardDailyGoalsHint.textContent = "Completed ";
        }

        else{
            dashboardDailyGoalsHint.textContent = `${pending} Remaining`;
        }
    }
}











// ********************* //// ********************* //
// Preventing the user after refresh //
// ********************* //// ********************* //
window.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();

    startBtn.addEventListener("click", () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        startPomodoro();
    });

    if (!JSON.parse(localStorage.getItem("isLoggedIn"))) return;

    updateDashboard();
    updateDashboardStats();
    updateAuthUI();
    renderTask();
    renderPlanner();
    getWeather();
    initializePomodoro();
    updatePomodoroUI();



    const pomodoro = getPomodoro();

    if(pomodoro.isRunning){
        pomodoro.isRunning = false;
        savePomodoro(pomodoro);
        startBtn.disabled = false;
        startBtn.innerHTML = `<i class="ri-play-fill"></i>Resume`;
    }
});




