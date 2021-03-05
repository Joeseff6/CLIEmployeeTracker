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
                setTimeout(runApp,2000);
                break;
            case `View all employees by department`:
                functions.getEmployeesDepartment()
                setTimeout(runApp,2000);
                break;
            case `View all employees by Manager`:
                break;
            case `Add Employee`:
                break;
            case `Remove Employee`:
                break;
            case `Update Employee role`:
                break;
            case `Update employee manager`:
                break;
            case `Exit`:
                functions.exit();
                setTimeout(runApp,2000);
                break;
        }
    })
};