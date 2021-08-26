const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

// Connect to workplace_db database
const workplaceDatabase = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "workplace_db"
    },
    console.log("Connected to the workplace_db database.")
);

// Create a question to ask user how they would like to interact with the database
const question = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit", new inquirer.Separator()],
        name: "choice",
    }
];

function init() {
    mainMenu();
}

// Initialize inquirer session
function mainMenu() {
    inquirer
        .prompt(question)
        .then((response) => {
            // If user chooses to view all departments,
            if (response.choice === "View All Departments") {
                renderTable("department");

                return mainMenu();
            } 
            // If user chooses to view all roles,
            else if (response.choice === "View All Roles") {
                renderTable("role");

                return mainMenu();
            } 
            // If user chooses to view all employees,
            else if (response.choice === "View All Employees") {
                renderTable("employee");

                return mainMenu();
            } 
            // If user chooses to add a department,
            else if (response.choice === "Add A Department") {
                console.log("add department row");

                return mainMenu();
            } 
            // If user chooses to add a role,
            else if (response.choice === "Add A Role") {
                console.log("add role row");

                return mainMenu();
            } 
            // If user chooses to add an employee,
            else if (response.choice === "Add An Employee") {
                console.log("add employee row");

                return mainMenu();
            } 
            // If user chooses to update an employee role,
            else if (response.choice === "Update An Employee Role") {
                console.log("change employee role");

                return mainMenu();
            } 
            // If user chooses to quit,
            else if (response.choice === "Quit") {
                return;
            }
        })
}

// Render table to terminal
function renderTable(table) {
    workplaceDatabase.query(`SELECT * FROM ${table} LIMIT 100`, function(err, results) {
        console.log(`\n`);
        console.table(results);
    })
}

init();