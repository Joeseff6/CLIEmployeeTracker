require(`dotenv`).config();
const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const consoleTable = require(`console.table`);

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_USERNAME,
    database: 'employees_db',
});

const functions = {
    getEmployeesDepartment: () => {
        connection.query('SELECT name FROM department', (err, res) => {
            if (err) throw err;
            let departmentList = res.map(department => department.name);
            console.log(departmentList);
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
                    query += 
                    `FROM employee e `;
                    query +=
                    `INNER JOIN role r ON (e.role_id = r.id) `;
                    query +=
                    `INNER JOIN department d ON (r.department_id = d.id) `;
                    query +=
                    `WHERE name = ?;`;
                                
                connection.query(query,[response.department], (err,res) => {
                    if (err) throw err;
                    console.table(res);
                });
            });
        });
    },
    
    getEmployees: () => {
        connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
                console.log(`There are currently no employees. Time to hire!`)
                console.log(`------------------------------------------------\n\n`)
            } else {
                console.log('Here are the current employees:\n');
                console.table(res);
                console.log(`------------------------------------------------\n\n`)
            }
        });
    },

    exit: () => {
        console.log(`Goodbye!`);
        console.log(`Ending connection...`);
        connection.end;
        setTimeout(process.exit(),1000);
    }
}

module.exports = functions;