# employee-tracker

## Description

JavaScript application that allows the user to interact with an employee database through the command line.

## Table of Contents

* [Installation](#Installation)
* [Usage](#Usage)
* [Tests](#Tests)
* [Questions](#Questions)

## Installation

Required packages:
  * Node.js
  * Inquirer.js
  * console.table
  * MySQL2

## Usage

To invoke the application the user must insert their MySQL password on line 10 of `index.js`, and run these commands in the terminal:

```bash
mysql> source db/schema.sql;
mysql> source db/seeds.sql;
node index.js
```

The user will then be presented with a series of questions within the terminal regarding how they want to interact with the database. The `workplace_db` database has a department, role, and employee table. From the command line, the user can:

* View all departments
* View all roles
* View all employees
* Add a department
* Add a role
* Add an employee
* Update an employee role

## Tests

![Walkthrough Video](./images/employee-tracker.gif)

## Questions

Do you have questions? Contact me here:

* [GitHub](https://github.com/laurenlgoss)
* [Email](laurenlgoss98@gmail.com)