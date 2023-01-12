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

const newDepartment = () => {
    prompt([
        {
          name: 'department',
          message: 'Enter the department to be added.',
        },
    ])
    .then((answer) => {
        db.query('INSERT INTO department (name) VALUES ("' + answer.department + '");')
        console.log('Department successfully added!');
        init();
    });
}
const newEmployee = () => {
    prompt([
        {
          name: 'first_name',
          message: 'Enter the employee\'s first name.',
        },
        {
          name: 'last_name',
          message: 'Enter the employee\'s last name.',
        },
        {
          name: 'role_id',
          message: 'Enter the employee\'s role id.',
        },
        {
          name: 'manager_id',
          message: 'Enter the employee\'s manager id.',
        },
        
    ])
    .then((answer) => {
        db.query('INSERT INTO employee (first_name, last_name, role_id,manager_id) VALUES ("' + answer.first_name + '"' + ',' + '"' + answer.last_name + '"' + ',' + answer.role_id + ',' + answer.manager_id + ');')
        console.log('Employee successfully added!');
        init();
    });
}

const newRole = () => {
    prompt([
        {
          name: 'title',
          message: 'Enter the role\'s title.',
        },
        {
          name: 'salary',
          message: 'Enter the role\'s salary.',
        },
        {
          name: 'department_id',
          message: 'Enter the role\'s department id.',
        },
    ])
    .then((answer) => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES ("' + answer.title + '"' + ',' + answer.salary + ',' + answer.department_id + ');')
        console.log('Role successfully added!');
        init();
    });
}

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
        case 'Add new department': {
            newDepartment();
            };
            break;
        case 'Add new role': {
            newRole();
            };
            break;
        case 'Add new employee': {
            newEmployee();
            };
            break;
        };
    };

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'Choose one of the following options.',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'Add new department',
            'Add new role',
            'Add new employee',
        ],
        name: 'type',
    })
    .then((answers) => {
        chooseOption(answers.type);
    });
}

init();