let loginForm = document.querySelector("#login-form")
let registerForm = document.querySelector("#register-form")
let loginUsername = document.querySelector("#login-username")
let loginPassword = document.querySelector("#login-password")
let registerBtn = document.querySelector("#register")
let loginBtn = document.querySelector("#login")
let logoutBtn = document.querySelector(".logout-btn")
let registerUsername = document.querySelector("#register-username");
let registerPassword = document.querySelector("#register-password");
let sidebar = document.querySelector("aside");
let main = document.querySelector("main");
let detailsForm = document.querySelector("#details-form")

let settingsBtn = document.querySelector("#settings-btn");
let dashboardBtn = document.querySelector("#dashboard-btn")
let settingsPage = document.querySelector(".settings")
let dashboardPage = document.querySelector(".dashboard");

let addTransactionBtn = document.querySelector(".add-transaction-btn")
let addTransactionFormContainer = document.querySelector(".add-transaction-form-container")
let addTransactionForm = document.querySelector(".add-transaction-form")
let cancelTransaction = document.querySelector("#cancel-transaction");

let transactionTypeInput = document.querySelector("#transaction-type")
let transactionDescriptionInput = document.querySelector("#transaction-description")
let transactionAmount = document.querySelector("#transaction-amount")
let transactionDate = document.querySelector("#transaction-date")
let transactionCategory = document.querySelector("#transaction-category");

let transactionsContainer = document.querySelector("#transactions-container");

let totalIncomeElem = document.querySelector("#total-income");
let totalExpenseElem = document.querySelector("#total-expense");
let currentBalanceElem = document.querySelector("#current-balance");
let totalTransactionsElem = document.querySelector("#total-transactions");

let deleteAllTransactionsBtn = document.querySelector("#delete-all-transactions");


let updateSettingsBtn = document.querySelector("#update-settings-btn");
let settingsForm = document.querySelector("#details-form")
let fullName = document.querySelector("#fullName");

let currencySignElems = document.querySelectorAll(".currency-sign");
let currencyInput = document.querySelector("#currency");
let userNameElem = document.querySelector(".userName");

let darkThemeBtn = document.querySelector("#dark-theme-icon")
let lightThemeBtn = document.querySelector("#light-theme-icon")

let body = document.body;

let switchToLoginBtn = document.querySelector("#switch-to-login")
let switchToRegisterBtn = document.querySelector("#switch-to-register")


let searchInput = document.querySelector("#search-input");

let filterByType = document.querySelector(".options");



let editIndex = null;     // for edit transaction




const updateTotalIncome = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let totalIncome = transactions.reduce((total, transaction) => {
        if (transaction.type === "income") {
            return total + transaction.amount;
        }
        return total;
    }, 0);

    totalIncomeElem.textContent = totalIncome;
}


const updateTotalExpense = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let totalIncome = transactions.reduce((total, transaction) => {
        if (transaction.type === "expense") {
            return total + transaction.amount;
        }
        return total;
    }, 0);

    totalExpenseElem.textContent = totalIncome;
}

const updateCurrentBalance = () => {
    let totalIncome = Number(totalIncomeElem.textContent);
    let totalExpense = Number(totalExpenseElem.textContent);
    let currentBalance = totalIncome - totalExpense;
    currentBalanceElem.textContent = currentBalance;
}

const updateTotalTransactions = () => { 
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    totalTransactionsElem.textContent = transactions.length;
}




let cashFlowChart;

const createChart = () => {
    const ctx = document.getElementById("cashFlowChart");
  
    cashFlowChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Income vs Expenses"],
            datasets: [
                {
                    label: "Income",
                    data: [0],
                    backgroundColor: "#16A34A",
                    borderRadius: 10,
                },{
                    label: "Expenses",
                    data: [0],
                    backgroundColor: "#DC2626",
                    borderRadius: 10,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};
createChart();


const updateChart = () => { 
    cashFlowChart.data.datasets[0].data = [Number(totalIncomeElem.textContent)]
    cashFlowChart.data.datasets[1].data = [Number(totalExpenseElem.textContent)]

    cashFlowChart.update();
}




const updateDashboard = () => { 
    updateTotalIncome();
    updateTotalExpense();
    updateCurrentBalance();
    updateTotalTransactions();
    updateChart();
}




const renderSettings = () => {
    const settings = JSON.parse(localStorage.getItem("settings"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!settings) {
        if (currentUser) {
            userNameElem.textContent = currentUser.userName;
            fullName.value = currentUser.userName;
        }
        return;
    }
    userNameElem.textContent = settings.fullName;
    fullName.value = settings.fullName;

    currencyInput.value = settings.currency;

    currencySignElems.forEach((elem) => {
        elem.textContent = settings.currency;
    });
}

settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const settings = {
        fullName: fullName.value,
        currency: currencyInput.value
    };

    localStorage.setItem("settings", JSON.stringify(settings));

    alert("Changes Saved");

    renderSettings();
});







deleteAllTransactionsBtn.addEventListener("click", () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || []; 
    transactions = []
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateDashboard();

    transactionsContainer.innerHTML = ""
})






let renderTransaction = (transactions) => { 
    transactionsContainer.innerHTML = "";

    transactions.forEach((transaction, index) => { 
        transactionsContainer.innerHTML += `<tr>
                            <td>${transaction.date}</td>
                            <td>${transaction.description}</td>
                            <td id="category"><span>${transaction.category}</span></td>
                            <td id="amount">$${transaction.amount}</td>
                            <td class="actions">
                                <i class="ri-pencil-fill  edit-btn" data-index="${index}"></i>
                                <i class="ri-delete-bin-5-line  delete-btn" data-index="${index}"><i>
                            </td>
                        </tr>`
    })
}




// Starting Render functionality: after login it will render all previous transactions 
const loadTransactions = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    renderTransaction(transactions);
}



// Search Transactions by  salary, income, amount, date functionality
const searchTransactions = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let searchValue = searchInput.value.toLowerCase().trim();

    let filteredTransactions = transactions.filter((transaction) => {
        return (
            transaction.description.toLowerCase().includes(searchValue) ||
            transaction.category.toLowerCase().includes(searchValue) ||
            transaction.type.toLowerCase().includes(searchValue) ||
            transaction.date.toLowerCase().includes(searchValue) ||
            transaction.amount.toString().includes(searchValue)
        );
    });

    renderTransaction(filteredTransactions);
}


// this line renders the transactions after typing a letter
searchInput.addEventListener("input", searchTransactions);



// Functionality to search transactions  by transaction type
filterByType.addEventListener("change", () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (filterByType.value === "all") {
        renderTransaction(transactions);
    }
    else {
        let filtered = transactions.filter((transaction) => transaction.type === filterByType.value );
        renderTransaction(filtered);
    }
});



// This function checks , is there any user exist if yes then login form appears or if not then create account form appear if user logged in then dashboard appears else login form appears.
let checkAuthentication = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (users.length === 0) {
        registerForm.style.display = "flex";
        loginForm.style.display = "none";
        sidebar.style.display = "none";
        main.style.display = "none";

        registerUsername.value = ""
        registerPassword.value = ""
    }
    else if (isLoggedIn) {
        registerForm.style.display = "none";
        loginForm.style.display = "none";
        sidebar.style.display = "flex";
        main.style.display = "block";
        dashboardBtn.classList.add("active-link")

        loginUsername.value = ""
        loginPassword.value = ""
    }
    else {
        registerForm.style.display = "none";
        loginForm.style.display = "flex";
        sidebar.style.display = "none";
        main.style.display = "none";
    }
};








registerBtn.addEventListener("click", (e) => { 
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
        userName: registerUsername.value,
        password: registerPassword.value,
    }

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("settings", JSON.stringify(
        {
            fullName: registerUsername.value,
            currency: "$",
        }
    ));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registration Successful")
    checkAuthentication();
})


loginBtn.addEventListener("click", (e) => { 
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find((u) => u.userName === loginUsername.value && u.password === loginPassword.value);

    if (user) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login Successful")
        checkAuthentication();

        renderSettings();

        loadTransactions();
        updateDashboard();
    }
    else { 
        alert("Invalid Credentials!");
    }
})


logoutBtn.addEventListener("click", () => { 
    localStorage.setItem("isLoggedIn", false);
    checkAuthentication();

    settingsBtn.classList.remove("active-link")
    dashboardBtn.classList.add("active-link")

    settingsPage.style.display = "none"
    dashboardPage.style.display = "block"
})

checkAuthentication();

if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
    loadTransactions();
    updateDashboard();
    renderSettings();
}





dashboardBtn.addEventListener("click", () => { 
    settingsPage.style.display = "none"
    dashboardPage.style.display = "block"

    settingsBtn.classList.remove("active-link");
    dashboardBtn.classList.add("active-link");
})

settingsBtn.addEventListener("click", () => { 
    dashboardPage.style.display = "none"
    settingsPage.style.display = "block";

    dashboardBtn.classList.remove("active-link");
    settingsBtn.classList.add("active-link");
})





addTransactionBtn.addEventListener("click", () => { 
    addTransactionFormContainer.style.display = "flex"
})

cancelTransaction.addEventListener("click", () => { 
    addTransactionFormContainer.style.display = "none"
})





addTransactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


    if (editIndex !== null) {
        transactions[editIndex] = {
            type: transactionTypeInput.value,
            description: transactionDescriptionInput.value,
            amount: Number(transactionAmount.value),
            date: transactionDate.value,
            category: transactionCategory.value
        };
        editIndex = null;
    } else {
        transactions.push({
            type: transactionTypeInput.value,
            description: transactionDescriptionInput.value,
            amount: Number(transactionAmount.value),
            date: transactionDate.value,
            category: transactionCategory.value
        });
    }

    localStorage.setItem("transactions", JSON.stringify(transactions))

    renderTransaction(transactions);
    updateDashboard();
    addTransactionForm.reset();

    addTransactionFormContainer.style.display = "none"
})






darkThemeBtn.addEventListener("click", () => { 
    lightThemeBtn.style.display = "inline-block"
    darkThemeBtn.style.display = "none"

    body.classList.add("dark")
})

lightThemeBtn.addEventListener("click", () => { 
    lightThemeBtn.style.display = "none"
    darkThemeBtn.style.display = "inline-block"

    body.classList.remove("dark")
})





switchToRegisterBtn.addEventListener("click", () => { 
    loginForm.style.display = "none"
    registerForm.style.display = "flex"
})

switchToLoginBtn.addEventListener("click", () => { 
    registerForm.style.display = "none"
    loginForm.style.display = "flex"
})


let deleteTransactionFunction = () => { 

}









const deleteTransaction = (index) => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransaction(transactions);

    updateDashboard();
}



const editTransaction = (index) => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    editIndex = index;

    let transaction = transactions[index];
    addTransactionFormContainer.style.display = "flex";

    transactionTypeInput.value = transaction.type;
    transactionDescriptionInput.value = transaction.description;
    transactionAmount.value = transaction.amount;
    transactionDate.value = transaction.date;
    transactionCategory.value = transaction.category;
}


transactionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        let index = e.target.dataset.index;
        deleteTransaction(index);
    }

    if (e.target.classList.contains("edit-btn")) {
        let index = e.target.dataset.index;
        editTransaction(index);
    }
});
