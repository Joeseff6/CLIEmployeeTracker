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
            case `View all employees by department`:
                getEmployeesDepartment();
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
                exit();
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
            setTimeout(runApp,2000);
        } else {
            console.log('Here are the current employees:\n');
            console.table(res);
            console.log(`------------------------------------------------\n\n`)
            setTimeout(runApp,2000);
        }
    });
};

const getEmployeesDepartment = () => {
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
                `SELECT d.name, first_name, last_name, r.title, `;
                query += 
                `FROM employee e `;
                query +=
                `INNER JOIN role r ON (e.role_id = r.id) `;
                query +=
                `INNER JOIN department d ON (r.department_id = d.id) `;
                query +=
                `WHERE name = ?`;
            
            connection.query(query,[response.department], (err,res) => {
                if (err) throw err;
                console.table(res)
                setTimeout(runApp,2000);
            });
        });
    });
} 

const exit = () => {
    console.log(`Goodbye!`);
    connection.end;
    process.exit();
}