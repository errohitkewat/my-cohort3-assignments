let loginForm = document.querySelector("#login-form")
let loginUsername = document.querySelector("#login-username")
let loginPassword = document.querySelector("#login-password")
let registerForm = document.querySelector("#register-form")
let registerBtn = document.querySelector("#register")
let loginBtn = document.querySelector("#login")
let logoutBtn = document.querySelector(".logout-btn")
let registerUsername = document.querySelector("#register-username");
let registerPassword = document.querySelector("#register-password");
let sidebar = document.querySelector("aside");
let main = document.querySelector("main");
let saveChangesBtn = document.querySelector("#saveChanges");
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
                },
                {
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



deleteAllTransactionsBtn.addEventListener("click", () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || []; 
    transactions = []
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateDashboard();

    transactionsContainer.innerHTML = ""
})






let renderTransaction = (transactions) => { 
    transactionsContainer.innerHTML = "";

    transactions.forEach((transaction) => { 
        transactionsContainer.innerHTML += `<tr>
                                <td>${transaction.date}</td>
                                <td>${transaction.description}</td>
                                <td id="category"><span>${transaction.category}</span></td>
                                <td id="amount">$${transaction.amount}</td>
                                <td class="actions">
                                    <i id="edit" class="ri-pencil-fill"></i>
                                    <i id="del" class="ri-delete-bin-5-line"></i>
                                </td>
                            </tr>`
    })
}





const loadTransactions = () => {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    renderTransaction(transactions);
}







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

    alert("Registration Successful")
    checkAuthentication();
})


loginBtn.addEventListener("click", (e) => { 
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find((u) => u.userName === loginUsername.value && u.password === loginPassword.value);

    if (user) {
        localStorage.setItem("isLoggedIn", true);
        alert("Login Successful")
        checkAuthentication();

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


    let newTransaction = {
        type: transactionTypeInput.value,
        description: transactionDescriptionInput.value,
        amount: Number(transactionAmount.value),
        date: transactionDate.value,
        category: transactionCategory.value
    }

    transactions.push(newTransaction);

    localStorage.setItem("transactions", JSON.stringify(transactions))

    renderTransaction(transactions);
    updateDashboard();
    addTransactionForm.reset();

    addTransactionFormContainer.style.display = "none"
})



