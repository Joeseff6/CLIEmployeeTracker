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

const departmentList = [`Engineering`, `Project Management`,`Supply Chain Management`, `Operations`, `Quality`];

const insertEmployee = function(newEmployee) {
    if (newEmployee.managerId !== null) {
        let query = `INSERT INTO employee(first_name,last_name,role_id,manager_id) `
        query += `VALUES ('${newEmployee.firstName}','${newEmployee.lastName}','${newEmployee.roleId}','${newEmployee.managerId}');`
        connection.query(query, (err,res) => {
            if (err) throw err;
            console.log(`Employee added!\n`);
            setTimeout(runApp,2000);
        });
    } else {
        let query = `INSERT INTO employee(first_name,last_name,role_id) `
        query += `VALUES ('${newEmployee.firstName}','${newEmployee.lastName}','${newEmployee.roleId}');`
        connection.query(query, (err,res) => {
            if (err) throw err;
            console.log(`Employee added!\n`);
            setTimeout(runApp,2000);
        });
    };
};

const functions = {
    addEmployee: () => {
        inquirer.prompt(questions.addEmployeeQuestions).then(answer => {
            let newEmployee = new Employee(answer.firstName,answer.lastName,answer.department,answer.title,answer.salary);
            connection.query(`SELECT id FROM department WHERE name = '${newEmployee.department}'`, (err,res) => {
                if (err) throw err;
                let departmentId = res[0].id;
                let query = `INSERT INTO role(title,salary,department_id) `
                query += `VALUES ('${newEmployee.title}','${newEmployee.salary}','${departmentId}')`
                connection.query(query, (err,res) => {
                    if (err) throw err;
                    connection.query(`SELECT id FROM role ORDER BY id`, (err,res) => {
                        newEmployee.roleId = res[res.length-1].id;
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
                                        let query = `SELECT r.id FROM role r INNER JOIN employee e ON (e.role_id = r.id) `;
                                        query += `WHERE first_name = '${answer.manager}'`;
                                        connection.query(query, (err,res) => {
                                            newEmployee.managerId = res[0].id;
                                            insertEmployee(newEmployee);
                                        })
                                    });
                                });
                            });
                        } else {
                            newEmployee.managerId = null;
                            insertEmployee(newEmployee);
                        };
                    });
                });
            });
        });
    },

    exit: () => {
        console.log(`Goodbye!\nEnding connection...`);
        connection.end;
        setTimeout(process.exit(),2000);
    },

    getEmployees: () => {
        let query = 
        `SELECT e.first_name, e.last_name, r.title, r.salary, d.name `;
        query += `FROM employee e `;
        query += `INNER JOIN role r ON (e.role_id = r.id) `;
        query += `INNER JOIN department d ON (r.department_id = d.id) `;
        connection.query(query, (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                console.log(`There are currently no employees. Time to hire!`)
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
                if (res.length === 0) {
                    console.log(`There are no employees in this department. Time to hire!\n`);
                    setTimeout(runApp,2000);
                } else {
                    console.table(res);
                    setTimeout(runApp,2000);
                }

            });
        });
    },

    removeEmployee: () => {
        connection.query(`SELECT first_name,last_name FROM employee`, (err,res) => {
            let employeeList = res.map(employee => employee.first_name + ` ` + employee.last_name);
            inquirer.prompt([
                {
                    type: `list`,
                    name: `employee`,
                    message: `Who do you want to remove?`,
                    choices: employeeList
                }
            ]).then(answer => {
                query = `SELECT r.id FROM role r INNER JOIN employee e ON (e.role_id = r.id) `;
                query += `WHERE CONCAT(e.first_name,' ',e.last_name) = '${answer.employee}'`
                connection.query(query, (err,res) => {
                    if (err) throw err;
                    let roleId = res[0].id;
                    connection.query(`DELETE FROM role WHERE id = ${roleId}`, (err,res) => {
                        if (err) throw err;
                        console.log(`Employee removed.\n`)
                        setTimeout(runApp,2000);
                    });
                });
            });
        });
    },

    updateEmployeeSalary: () => {
        connection.query(`SELECT first_name,last_name FROM employee`, (err,res) => {
            let employeeList = res.map(employee => employee.first_name + ` ` + employee.last_name);
            inquirer.prompt([
                {
                    type: `list`,
                    name: `employee`,
                    message: `Which employee do you want to update?`,
                    choices: employeeList
                }
            ]).then(answer => {
                let employee = answer.employee;
                inquirer.prompt([
                    {
                        type: `number`,
                        name: `updateSalary`,
                        message: `Please input the new salary:`
                    }
                ]).then(answer => {
                    let newSalary = answer.updateSalary;
                    query = `SELECT r.id FROM role r INNER JOIN employee e ON (e.role_id = r.id) `;
                    query += `WHERE CONCAT(e.first_name,' ',e.last_name) = '${employee}'`
                    connection.query(query, (err,res) => {
                        if (err) throw err;
                        let roleId = res[0].id;
                        connection.query(`UPDATE role SET salary = ${newSalary} WHERE id = ${roleId}`, (err,res) => {
                            if (err) throw err;
                            console.log(`${employee}'s salary has been updated to ${newSalary}.\n`);
                            setTimeout(runApp,2000);
                        });
                    });
                });
            });
        });
    },

    updateEmployeeTitle: () => {
        connection.query(`SELECT first_name,last_name FROM employee`, (err,res) => {
            let employeeList = res.map(employee => employee.first_name + ` ` + employee.last_name);
            inquirer.prompt([
                {
                    type: `list`,
                    name: `employee`,
                    message: `Which employee do you want to update?`,
                    choices: employeeList
                }
            ]).then(answer => {
                let employee = answer.employee;
                inquirer.prompt([
                    {
                        type: `input`,
                        name: `updateTitle`,
                        message: `What is the employee's new title?`
                    }
                ]).then(answer => {
                    let newTitle = answer.updateTitle;
                    query = `SELECT r.id FROM role r INNER JOIN employee e ON (e.role_id = r.id) `;
                    query += `WHERE CONCAT(e.first_name,' ',e.last_name) = '${employee}'`
                    connection.query(query, (err,res) => {
                        if (err) throw err;
                        let roleId = res[0].id;
                        connection.query(`UPDATE role SET title = '${newTitle}' WHERE id = ${roleId}`, (err,res) => {
                            if (err) throw err;
                            console.log(`${employee}'s title has been updated to ${newTitle}.\n`);
                            setTimeout(runApp,2000);
                        });
                    });
                });
            });
        });
    },

    viewDepartments: () => {
        connection.query(`SELECT name FROM department`, (err,res) => {
            if (err) throw err;
            console.table(res);
            console.log(`\n`);
            setTimeout(runApp,2000);
        });
    }
};

const runApp = () => {
    console.log(`Welcome to the Employee Tracker!`);
    inquirer.prompt(questions.menuChoices).then(response => {
        switch (response.menuChoice) {
            case `View all employees`:
                functions.getEmployees();
                break;
            case `View departments`:
                functions.viewDepartments()
                break;
            case `View all employees by department`:
                functions.getEmployeesDepartment()
                break;
            case `Add employee`:
                functions.addEmployee();
                break;
            case `Remove employee`:
                functions.removeEmployee();
                break;
            case `Update employee title`:
                functions.updateEmployeeTitle();
                break;
            case `Update employee salary`:
                functions.updateEmployeeSalary();
                break;
            case `Exit`:
                functions.exit();
                break;
        };
    });
};

module.exports = functions;