require(`dotenv`).config();
const consoleTable = require(`console.table`);
const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const questions = require(`./questions`);
const functions = require(`./functions`);

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_USERNAME,
    database: 'employees_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    runApp()
});


const runApp = () => {
    console.log(`Welcome to the Employee Tracker!`);
    inquirer.prompt(questions.menuChoices).then(response => {
        switch (response.menuChoice) {
            case `View all employees`:
                functions.getEmployees();
                break;
            case `View all employees by department`:
                functions.getEmployeesDepartment()
                break;
            case `View all employees by manager`:
                break;
            case `Add employee`:
                functions.addEmployee();
                break;
            case `Remove employee`:
                break;
            case `Update employee role`:
                break;
            case `Update employee manager`:
                break;
            case `Exit`:
                functions.exit();
                break;
        }
    })
};