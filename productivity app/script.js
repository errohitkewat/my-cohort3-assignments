const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginBtn = document.querySelector(".user-login-btn")
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
// Show Login Form Logic //
// ************************** //
loginBtn.addEventListener("click", () => { 
    authOverlay.style.display = "flex"
    registerForm.classList.add("hidden")
    loginForm.classList.remove("hidden")
})

document.getElementById("showRegister").onclick = (e)=>{
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
}

document.getElementById("showLogin").onclick = (e)=>{
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
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
        greet.textContent = "Good Morning"
    }
    if (hour < 17) { 
        greet.textContent = "Good Afternoon"
    }
    if (hour < 21) { 
        greet.textContent = "Good Evening"
    }
    greet.textContent = "Good Night"
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