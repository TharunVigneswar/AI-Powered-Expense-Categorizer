document.addEventListener("DOMContentLoaded", function () {
    loadExpensesFromLocalStorage();
});

const expenseTable = document.getElementById("expense-list");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const aiCategory = document.getElementById("ai-category");

const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart;

// Function to add a new expense
function addExpense() {
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();

    if (!amount || !description) {
        alert("Please enter both amount and description!");
        return;
    }

    const category = predictCategory(description);
    aiCategory.textContent = category;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${amount.toFixed(2)}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td><button onclick="deleteExpense(this)">❌</button></td>
    `;

    expenseTable.appendChild(newRow);
    saveExpensesToLocalStorage();
    updatePieChart();

    // Clear input fields
    amountInput.value = "";
    descriptionInput.value = "";
}

// Function to delete an expense row
function deleteExpense(button) {
    button.parentElement.parentElement.remove();
    saveExpensesToLocalStorage();
    updatePieChart();
}

// Function to clear all expenses
function clearTable() {
    expenseTable.innerHTML = "";
    saveExpensesToLocalStorage();
    updatePieChart();
}

// Function to save expenses to localStorage
function saveExpensesToLocalStorage() {
    const expenses = [];
    document.querySelectorAll("#expense-list tr").forEach(row => {
        const cells = row.children;
        expenses.push({
            amount: cells[0].textContent,
            description: cells[1].textContent,
            category: cells[2].textContent
        });
    });
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to load expenses from localStorage
function loadExpensesFromLocalStorage() {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    expenses.forEach(expense => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense(this)">❌</button></td>
        `;
        expenseTable.appendChild(newRow);
    });
    updatePieChart();
}

// Function to load expenses from CSV or Excel
function loadCSV() {
    const fileInput = document.getElementById("csvFile").files[0];
    if (!fileInput) {
        alert("Please select a file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const lines = event.target.result.split("\n").map(line => line.split(","));
        lines.forEach(([amount, description]) => {
            if (amount && description) {
                const category = predictCategory(description);
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${parseFloat(amount).toFixed(2)}</td>
                    <td>${description.trim()}</td>
                    <td>${category}</td>
                    <td><button onclick="deleteExpense(this)">❌</button></td>
                `;
                expenseTable.appendChild(newRow);
            }
        });
        saveExpensesToLocalStorage();
        updatePieChart();
    };

    reader.readAsText(fileInput);
}

// Function to export expenses to Excel
function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const table = document.getElementById("expense-table");
    
    const ws = XLSX.utils.table_to_sheet(table, { raw: true });
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    // Remove buttons from export
    for (let i = 0; i < ws["!ref"].split(":")[1][1]; i++) {
        delete ws[`D${i + 1}`];
    }

    XLSX.writeFile(wb, "Expenses.xlsx");
}

// Function to update the pie chart
function updatePieChart() {
    const categoryTotals = {};
    document.querySelectorAll("#expense-list tr").forEach(row => {
        const category = row.children[2].textContent;
        const amount = parseFloat(row.children[0].textContent);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 0, bottom: 0 } },
            plugins: {
                legend: {
                    position: "top",
                    labels: { padding: 5, boxWidth: 15 }
                }
            }
        }
    });
}
