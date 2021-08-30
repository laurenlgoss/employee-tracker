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

function init() {
    mainMenu();
}

// Initialize inquirer session
function mainMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit", new inquirer.Separator()],
                name: "choice"
            }
        ])
        .then((response) => {
            if (response.choice !== "Quit") {
                // If user chooses to view all departments,
                if (response.choice === "View All Departments") {
                    renderTable("SELECT * FROM department LIMIT 100;");
                }
                // If user chooses to view all roles,
                else if (response.choice === "View All Roles") {
                    // Join role and department tables
                    renderTable("SELECT * FROM role JOIN department ON role.department_id = department.id;");
                }
                // If user chooses to view all employees,
                else if (response.choice === "View All Employees") {
                    // Join employee, department and role tables
                    renderTable(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name 
                    FROM employee 
                    JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id 
                    LEFT JOIN employee manager ON manager.id = employee.manager_id;`);
                }
                // If user chooses to add a department,
                else if (response.choice === "Add A Department") {
                    addDepartment();
                }
                // If user chooses to add a role,
                else if (response.choice === "Add A Role") {
                    addRole();
                }
                // If user chooses to add an employee,
                else if (response.choice === "Add An Employee") {
                    addEmployee();
                }
                // If user chooses to update an employee role,
                else if (response.choice === "Update An Employee Role") {
                    updateRole();
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

// Render table to terminal given MySQL query, call mainMenu()
async function renderTable(query) {
    let tableData = await interactWithDatabase(query);

    // Render table to terminal
    console.table(tableData);

    return mainMenu();
}

// Add new department to department table
function addDepartment() {
    // Prompt user to enter department name
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter name of department: ",
                name: "name"
            }
        ])
        .then((response) => {
            // Insert new department into department table
            workplaceDatabase.query(`INSERT INTO department (name) VALUES ("${capitalizeFirstLetter(response.name)}");`, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`${capitalizeFirstLetter(response.name)} successfully inserted into department table.`);
                }

                return mainMenu();
            });
        })
}

// Add new role to role table
async function addRole() {
    // Retrieve all departments, create an array of department objects with name and id
    const departments = await interactWithDatabase("SELECT * FROM department;");

    const departmentArray = departments.map(department => ({
        name: department.name,
        value: department.id
    }))

    // Prompt user for information about their new role
    inquirer
        .prompt([
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
                type: "list",
                choices: departmentArray,
                message: "Choose department of role: ",
                name: "department"
            }
        ])
        .then((response) => {
            const roleObject = {
                title: capitalizeFirstLetter(response.title),
                salary: response.salary,
                department_id: response.department
            }

            // Insert new role into role table
            workplaceDatabase.query("INSERT INTO role SET ?", roleObject, function (err, results) {
                // If insert was successful,
                if (results.affectedRows === 1) {
                    console.log(`${roleObject.title} was successfully added to role table.`);

                    return mainMenu();
                } else {
                    console.log(err);
                }
            })
        })
}

// Add new employee to employee table
async function addEmployee() {
    // Retrieve all roles, create an array of role objects with title and id
    const roles = await interactWithDatabase("SELECT * FROM role;");

    const roleArray = roles.map(role => ({
        name: role.title,
        value: role.id
    }))

    // Retrieve all employees, create an array of employee objects with first/last name and id
    const employees = await interactWithDatabase("SELECT * FROM employee;");

    const employeeArray = employees.map(employee => ({
        name: employee.first_name.concat(" ", employee.last_name),
        value: employee.id
    }))

    // Add "None" object to employeeArray that returns the value null
    employeeArray.unshift({name: "None", value: null});

    // Prompt user for information about their new employee
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter employee's first name: ",
                name: "firstName"
            },
            {
                type: "input",
                message: "Enter employee's last name: ",
                name: "lastName"
            },
            {
                type: "list",
                choices: roleArray,
                message: "Choose role of employee: ",
                name: "role"
            },
            {
                type: "list",
                choices: employeeArray,
                message: "Choose manager of employee: ",
                name: "manager"
            }
        ])
        .then((response) => {
            const employeeObject = {
                first_name: capitalizeFirstLetter(response.firstName),
                last_name: capitalizeFirstLetter(response.lastName),
                role_id: response.role,
                manager_id: response.manager
            }

            // Insert new employee into employee table
            workplaceDatabase.query("INSERT INTO employee SET ?", employeeObject, function (err, results) {
                // If insert was successful,
                if (results.affectedRows === 1) {
                    console.log(`${employeeObject.first_name.concat(" ", employeeObject.last_name)} was successfully added to role table.`);

                    return mainMenu();
                } else {
                    console.log(err);
                }
            })
        })
}

// Update employee role
async function updateRole() {
    // Retrieve all roles, create an array of role objects with title and id
    const roles = await interactWithDatabase("SELECT * FROM role;");

    const roleArray = roles.map(role => ({
        name: role.title,
        value: role.id
    }))

    // Retrieve all employees, create an array of employee objects with first/last name and id
    const employees = await interactWithDatabase("SELECT * FROM employee;");

    const employeeArray = employees.map(employee => ({
        name: employee.first_name.concat(" ", employee.last_name),
        value: employee.id
    }))

    // Prompt user for employee and new role
    inquirer
        .prompt([
            {
                type: "list",
                choices: employeeArray,
                message: "Choose employee to update: ",
                name: "employee"
            },
            {
                type: "list",
                choices: roleArray,
                message: "Choose new role: ",
                name: "role"
            }
        ])
        .then((response) => {
            // Update employee role in employee table
            workplaceDatabase.query(`UPDATE employee SET role_id = ${response.role} WHERE id = ${response.employee};`, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Role successfully updated.");

                    return mainMenu();
                }
            })
        })
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