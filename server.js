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
      department.name as department,
      role.salary,
      CONCAT(
          manager.first_name,
          ' ',
          manager.last_name
      ) AS manager
      FROM employee
      JOIN role
      ON employee.role_id = role.id
      LEFT JOIN employee AS manager
      ON employee.manager_id = manager.id
      JOIN department
      ON role.department_id = department.id
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
            db.query('INSERT INTO department (name) VALUES ("' + answer.department + '");', (err) => {
                if (err) return console.error(err);
                console.log('Department successfully added!');
                init();
            });
        });
}
const newEmployee = async () => {
    const [roles] = await db.promise().query('SELECT title as name, id as value FROM role')
    const [managers] = await db.promise().query('SELECT CONCAT(first_name, " ", last_name) as name, id as value FROM employee')
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
            type: 'rawlist',
            name: 'role_id',
            message: 'Please choose the employee\'s role.',
            choices: roles,
        },
        {
            type: 'rawlist',    
            name: 'manager_id',
            message: 'Please choose the employee\'s manager.',
            choices: managers,
        },

    ])
        .then((answer) => {
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + answer.first_name + '"' + ',' + '"' + answer.last_name + '"' + ',' + answer.role_id + ',' + answer.manager_id + ');', (err) => {
                if (err) return console.error(err);
                console.log('Employee successfully added!');
                init();
            });
        });
}

const newRole = async () => {
    const [departments] = await db.promise().query('SELECT name, id as value FROM department')
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
            type: 'rawlist',
            name: 'department_id',
            message: 'Please choose the role\'s department.',
            choices: departments,
        },
    ])
        .then((answer) => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES ("' + answer.title + '"' + ',' + answer.salary + ',' + answer.department_id + ');', (err) => {
                if (err) return console.error(err);
                console.log('Role successfully added!');
                init();
            });
        });
}

const updateEmployeeRole = async () => {
    const [employees] = await db.promise().query('SELECT CONCAT (first_name, " ", last_name) AS name, id as value FROM employee')
    const [roles] = await db.promise().query('SELECT title as name, id as value FROM role')
    prompt([
        {
            type: 'rawlist',
            name: 'employee',
            message: 'Which employee\'s role would you like to update?',
            choices: employees,
        },
        {
            type: 'rawlist',
            name: 'role',
            message: 'What is that employee\'s new role?',
            choices: roles,
        },
    ])
        .then((answer) => {
            db.query('UPDATE employee SET role_id = ' + answer.role + ' WHERE employee.id = ' + answer.employee + ';', (err) => {
                if (err) return console.error(err);
                console.log('Employee role updated successfully!');
                init();
            });
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
        case 'Update employee role': {
            updateEmployeeRole();
        };
            break;
        case 'Exit Program': {
            process.exit();
        };
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
            'Update employee role',
            'Exit Program'
        ],
        name: 'type',
    })
        .then((answers) => {
            chooseOption(answers.type);
        });
}

init();