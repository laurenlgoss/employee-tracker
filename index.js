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
const MenuQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit", new inquirer.Separator()],
        name: "choice"
    }
];

const addDepartmentQuestion = [
    {
        type: "input",
        message: "Enter name of department: ",
        name: "name"
    }
];

function init() {
    mainMenu();
}

// Initialize inquirer session
function mainMenu() {
    inquirer
        .prompt(MenuQuestion)
        .then((response) => {
            if (response.choice !== "Quit") {
                // If user chooses to view all departments,
                if (response.choice === "View All Departments") {
                    // Render department table to terminal
                    renderTable("SELECT * FROM department LIMIT 100;");

                    return mainMenu();
                }
                // If user chooses to view all roles,
                else if (response.choice === "View All Roles") {
                    // Join role and department tables, render table to terminal
                    renderTable("SELECT * FROM role JOIN department ON role.department_id = department.id;");

                    return mainMenu();
                }
                // If user chooses to view all employees,
                else if (response.choice === "View All Employees") {
                    // Join employee and role tables, render table to terminal
                    renderTable("SELECT * FROM employee JOIN role ON employee.role_id = role.id;");

                    return mainMenu();
                }
                // If user chooses to add a department,
                else if (response.choice === "Add A Department") {
                    // Prompt user to enter department name
                    inquirer
                        .prompt(addDepartmentQuestion)
                        .then((response) => {
                            workplaceDatabase.query(`INSERT INTO department (name) VALUES ("${response.name}");`, function (err, results) {
                                console.log(results);
                                
                                console.log(`${response.name} successfully inserted into department table.`)

                                return mainMenu();
                            });
                        })
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
            }
            // If user chooses to quit,
            else {
                return;
            }
        })
}

// Take in MySQL query, render given table to terminal
function renderTable(query) {
    workplaceDatabase.query(query, function (err, results) {
        console.log(`\n`);
        console.table(results);
    });
}

init();