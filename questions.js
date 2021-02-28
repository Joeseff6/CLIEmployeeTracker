const mainMenu = [
    `View all employees`,
    `View all employees by department`,
    `View all employees by Manager`,
    'Add employee',
    `Remove employee`,
    `Update employee role`,
    `Update employee manager`
];

const questions = {
    menuChoices: [
        {
            type: `list`,
            name: `menuChoice`,
            message:`Select one of the following options:`,
            choices: mainMenu
        }
    ]
}


module.exports = questions;