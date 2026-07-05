const authPage = document.querySelector("#auth-page");
const authContainer = document.querySelector(".auth-container");

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

const registerBtn = document.querySelector("#register-btn")
const loginBtn = document.querySelector("#login-btn")

const registerUsernameInput = document.querySelector("#register-username")
const registerPasswordInput = document.querySelector("#register-password")
const registerEmailInput = document.querySelector("#register-email")

const loginUsernameInput = document.querySelector("#login-username")
const loginPasswordInput = document.querySelector("#login-password")
const loginEmailInput = document.querySelector("#login-email")

const showResisterBtn = document.querySelector("#show-register")
const showLoginBtn = document.querySelector("#show-login")

const dashboard = document.querySelector("#dashboard");
const username = document.querySelector("#username");

const themeBtn = document.querySelector("#theme-btn")
const lightIcon = document.querySelector(".light")
const darkIcon = document.querySelector(".dark")

const logoutBtn = document.querySelector("#logout-btn")






function checkLoggedInUser() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let currentUser = users.find(user => user.isLoggedIn);

    if (currentUser) {
        authPage.classList.add("hidden");
        dashboard.classList.remove("hidden");

        username.textContent = currentUser.userName;
    }
    if (currentUser.settings.theme === "dark") {
        document.body.classList.add("dark-theme");

        lightIcon.classList.add("hidden");
        darkIcon.classList.remove("hidden");
    } else {
        document.body.classList.remove("dark-theme");

        lightIcon.classList.remove("hidden");
        darkIcon.classList.add("hidden");
    }
}
checkLoggedInUser();







registerForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (registerUsernameInput.value.trim() === "" || registerPasswordInput.value.trim() === "" || registerEmailInput.value.trim() === "") {
        alert("Please fill all the fields ‼️")
        return
    }
    
    let newUser = {
        id: Date.now(),
        userName: registerUsernameInput.value.trim(),
        email: registerEmailInput.value.trim(),
        password: registerPasswordInput.value,
        isLoggedIn: false,
    
        settings: {
            theme: "light",
            currency: "INR"
        },
    
        transactions: [],
        budgets: [],
    
        profile: {
            fullName: "",
            email: "",
            phone: "",
            avatar: ""
        }
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Registration Successful 🥳")

    registerForm.reset();

    registerForm.classList.add("hidden")
    loginForm.classList.remove("hidden")
})




loginForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (loginPasswordInput.value.trim() === "" || loginEmailInput.value.trim() === "") { 
        alert("Please fill all the input fields ‼️");
        return;
    }

    let currentUser = users.find((user) => loginEmailInput.value === user.email);

    if (!currentUser) { 
        alert("User Doesn't Exist ‼️")
        return;
    }

    users.forEach(user => user.isLoggedIn = false);
    currentUser.isLoggedIn = true;
    localStorage.setItem("users", JSON.stringify(users));


    authPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    username.textContent = currentUser.userName;

    loginForm.reset();
})




showLoginBtn.addEventListener("click", () => { 
    loginForm.classList.remove("hidden")
    registerForm.classList.add("hidden")
})

showResisterBtn.addEventListener("click", () => { 
    loginForm.classList.add("hidden")
    registerForm.classList.remove("hidden")
})




logoutBtn.addEventListener("click", () => { 

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach(user => user.isLoggedIn = false);

    localStorage.setItem("users", JSON.stringify(users));

    dashboard.classList.add("hidden")
    authPage.classList.remove("hidden")
    registerForm.classList.add("hidden")
    loginForm.classList.remove("hidden")
})











themeBtn.addEventListener("click", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.isLoggedIn);

    if (!currentUser) return;

    if (currentUser.settings.theme === "light") {
        currentUser.settings.theme = "dark";
        document.body.classList.add("dark-theme");

        lightIcon.classList.add("hidden");
        darkIcon.classList.remove("hidden");
    }
    else {
        currentUser.settings.theme = "light";
        document.body.classList.remove("dark-theme");

        lightIcon.classList.remove("hidden");
        darkIcon.classList.add("hidden");

    }

    localStorage.setItem("users", JSON.stringify(users));
});


