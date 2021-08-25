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
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"],
        name: "choice",
    }
];

// Initialize inquirer session
function init() {
    inquirer
        .prompt(question)
        .then((response) => {
            console.log(response.choice);
        });
};

init();