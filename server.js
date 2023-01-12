const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: "root",
    database: "employees_db",
});

const viewEmployee = async () => {
    const finalEmployees = `
      SELECT
      employee.id,
      employee.first_name,
      employee.last_name,
      role.title,
      role.salary,
      CONCAT(
          manager.first_name,
          ' ',
          manager.last_name
      ) AS manager
      FROM employee
      JOIN role
      ON employee.role_id = role.id
      JOIN employee AS manager
      ON employee.manager_id = manager.id
      `
      const [employees] = await db.promise().query(finalEmployees);
      console.table(employees);
      init();
  };

const chooseOption = (type) => {
    switch (type) {
        case 'View all employees': {
            viewEmployee();
            break;
        };
        case 'View all departments': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        };
        case 'View all roles': {
            db.query('SELECT * FROM role', (err, roles) => {
                console.table(roles);
                init();
            });
            break;
        };
    }
}

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'Choose one of the following options.',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles'
        ],
        name: 'type',
    })
    .then((answers) => {
        chooseOption(answers.type);
    });
}

init();