require(`dotenv`).config();
const consoleTable = require(`console.table`);
const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const questions = require(`./questions`);

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
                getEmployees();
                break;
        }
    })
}

const getEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        if (res.length === 0) {
            console.log(`There are currently no employees. Time to hire!`)
            console.log(`------------------------------------------------\n\n`)
            runApp()
        } else {
            console.log('Here are the current employees:\n');
            console.table(res);
            connection.end();
            console.log(`------------------------------------------------\n\n`)
            runApp()
        }
    });
};