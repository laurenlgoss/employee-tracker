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
const menuQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit", new inquirer.Separator()],
        name: "choice"
    }
];

// Create a question to ask user for information about their new department
const addDepartmentQuestion = [
    {
        type: "input",
        message: "Enter name of department: ",
        name: "name"
    }
];

// Create questions to ask user for information about their new role
const addRoleQuestions = [
    {
        type: "input",
        message: "Enter title of role: ",
        name: "title"
    },
    {
        type: "input",
        message: "Enter salary of role: ",
        name: "salary"
    },
    {
        type: "input",
        message: "Enter department of role: ",
        name: "department"
    }
];

function init() {
    mainMenu();
}

// Initialize inquirer session
function mainMenu() {
    inquirer
        .prompt(menuQuestion)
        .then( async (response) => {
            if (response.choice !== "Quit") {
                // If user chooses to view all departments,
                if (response.choice === "View All Departments") {
                    let departmentData = await interactWithDatabase("SELECT * FROM department LIMIT 100;");

                    // Render table to terminal
                    console.table(departmentData);

                    return mainMenu();
                }
                // If user chooses to view all roles,
                else if (response.choice === "View All Roles") {
                    // Join role and department tables
                    let roleData = await interactWithDatabase("SELECT * FROM role JOIN department ON role.department_id = department.id;");

                    // Render table to terminal
                    console.table(roleData);

                    return mainMenu();
                }
                // If user chooses to view all employees,
                else if (response.choice === "View All Employees") {
                    // Join employee and role tables
                    let employeeData = await interactWithDatabase("SELECT * FROM employee JOIN role ON employee.role_id = role.id;");

                    // Render table to terminal
                    console.table(employeeData);

                    return mainMenu();
                }
                // If user chooses to add a department,
                else if (response.choice === "Add A Department") {
                    // Prompt user to enter department name
                    inquirer
                        .prompt(addDepartmentQuestion)
                        .then((response) => {
                            // Ensure department name is capitalized
                            let uppercaseDepartment = capitalizeFirstLetter(response.name);

                            // Insert new department into department table
                            workplaceDatabase.query(`INSERT INTO department (name) VALUES ("${uppercaseDepartment}");`, function (err, results) {
                                console.log(`${uppercaseDepartment} successfully inserted into department table.`);

                                return mainMenu();
                            });
                        })
                }
                // If user chooses to add a role,
                else if (response.choice === "Add A Role") {
                    // Prompt user to enter information about role
                    inquirer
                        .prompt(addRoleQuestions)
                        .then( async (response) => {
                            // Ensure department and role name are capitalized
                            let uppercaseDepartment = capitalizeFirstLetter(response.department);
                            let uppercaseRole = capitalizeFirstLetter(response.title);

                            // // Convert given department name into department id
                            let departmentId = await interactWithDatabase(`SELECT id FROM department WHERE name = "${uppercaseDepartment}";`);

                            console.log("departmentId: " + departmentId);

                            // Insert new role into role table
                            workplaceDatabase.query(`INSERT INTO role (title, salary, department_id) VALUES ("${uppercaseRole}", ${response.salary}, ${departmentId});`, function (err, results) {
                                console.log(`${uppercaseRole} successfully inserted into role table.`);

                                return mainMenu();
                            });
                        })
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

// Return promise with results of given MySQL query
function interactWithDatabase(query) {
    return new Promise((resolve, reject) => {
        workplaceDatabase.query(query, function (err, results) {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        })
    });
}

// Capitalize first letter of inputted string
function capitalizeFirstLetter(string) {
    var stringArray = string.split(" ");

    for (var i = 0; i < stringArray.length; i++) {
        stringArray[i] = stringArray[i].charAt(0).toUpperCase() + stringArray[i].slice(1);
    }

    return stringArray.join(" ");
}

init();