const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

// Connect to workplace_db database
const workplaceDatabase = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'workplace_db'
    },
    console.log(`Connected to the workplace_db database.`)
);