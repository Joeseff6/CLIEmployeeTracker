require(`dotenv`).config();
const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const consoleTable = require(`console.table`);
const questions = require(`./questions`);
const Employee = require(`./lib/Employee`);

const connection = mysql.createConnection({
    host: `localhost`,
    port: 3306,
    user: `root`,
    password: process.env.DB_USERNAME,
    database: `employees_db`,
});

const functions = {
    addEmployee: () => {
        inquirer.prompt(questions.addEmployeeQuestions).then(answer => {
            let newEmployee = new Employee(answer.firstName,answer.lastName,answer.department,answer.title,answer.salary);
            if (answer.hasManager === `Yes`) {
                connection.query(`SELECT * FROM employee`, (err, res) => {
                    if (err) throw err;
                    let query = `SELECT first_name FROM employee e `;
                    query += `INNER JOIN role r ON (e.role_id = r.id) `;
                    query += `WHERE r.title = 'Manager'`

                    connection.query(query, (err, res) => {
                        if (err) throw err;
                        let managerList = res.map(manager => manager.first_name);
                        inquirer.prompt([
                            {
                                type: `list`,
                                name: `manager`,
                                message: `Which manager does the employee report to?`,
                                choices: managerList
                            }
                        ]).then(answer => {
                            newEmployee.manager = answer.manager;
                        });
                    });
                });
            } else {
                newEmployee.manager = null;
            };
            let query = `INSERT INTO department(name) VALUES ('${newEmployee.department}');`;
            query += `INSERT INTO role(title,salary,department_id) `;
            query += `VALUES ('${newEmployee.title}','${newEmployee.salary}')`
            connection.query(query, (err, res) => {
                if (err) throw err;
            })

        });
    },

    exit: () => {
        console.log(`Goodbye!\nEnding connection...`);
        connection.end;
        setTimeout(process.exit(),2000);
    },

    getEmployees: () => {
        connection.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                console.log(`There are currently no employees. Time to hire!`)
                console.log(`------------------------------------------------\n\n`)
                setTimeout(runApp,2000);
            } else {
                console.log(`Here are the current employees:\n`);
                console.table(res);
                console.log(`------------------------------------------------\n\n`)
                setTimeout(runApp,2000);
            }
        });
    },

    getEmployeesDepartment: () => {
        connection.query(`SELECT name FROM department`, (err, res) => {
            if (err) throw err;
            let departmentList = res.map(department => department.name);
            inquirer.prompt([
                {
                    type: `list`,
                    name: `department`,
                    message: `Which department do you want to view?`,
                    choices: departmentList
                }
            ]).then(response => {
                let query = 
                    `SELECT d.name, first_name, last_name, r.title `;
                    query += `FROM employee e `;
                    query += `INNER JOIN role r ON (e.role_id = r.id) `;
                    query += `INNER JOIN department d ON (r.department_id = d.id) `;
                    query += `WHERE name = ?;`;

                connection.query(query,[response.department], (err,res) => {
                    if (err) throw err;
                    console.table(res);
                    setTimeout(runApp,2000);
                });
            });
        });
    },
};

runApp = () => {
    console.log(`Welcome to the Employee Tracker!`);
    inquirer.prompt(questions.menuChoices).then(response => {
        switch (response.menuChoice) {
            case `View all employees`:
                functions.getEmployees();
                break;
            case `View all employees by department`:
                functions.getEmployeesDepartment()
                break;
            case `View all employees by Manager`:
                break;
            case `Add Employee`:
                functions.addEmployee();
                break;
            case `Remove Employee`:
                break;
            case `Update Employee role`:
                break;
            case `Update employee manager`:
                break;
            case `Exit`:
                functions.exit();
                break;
        };
    });
};

module.exports = functions;