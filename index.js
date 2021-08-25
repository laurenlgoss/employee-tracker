const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

// Connect to employees_db database
const employeesDatabase = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);