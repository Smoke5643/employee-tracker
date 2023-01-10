USE employees_db;
INSERT INTO department (name)
    VALUES
    ('Sales'),
    ('Human Resources'),
    ('Finance'),
    ('Marketing');
INSERT INTO role (title, salary, department_id)
    VALUES
    ('Sales Manager', 90000, 1),
    ('Sales Supervisor', 80000, 1),
    ('Salesperson', 60000, 1),
    ('Human Resources Administrator', 85000, 2),
    ('Comptroller', 80000, 2),
    ('Personnel Manager', 60000, 2),
    ('Chief Fiancial Officer', 120000, 3),
    ('Finance Manager', 90000, 3),
    ('Financial Advisor', 70000, 3),
    ('Budget Analyst', 70000, 3),
    ('Marketing Director', 100000, 4),
    ('Content Manager', 70000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ('Karen', 'Carpenter', 1, null),
    ('Richard', 'Carpenter', 2, 1),
    ('John', 'Bettis', 3, 1),
    ('Jimi', 'Hendrix', 4, null),
    ('Noel', 'Redding', 5, 4),
    ('Mitch', 'Mitchell', 6, 4),
    ('Paul', 'McCartney', 7, null),
    ('John', 'Lennon', 8, 7),
    ('George', 'Harrison', 9, 7),
    ('Ringo', 'Starr', 9, 7),
    ('Paul', 'Simon', 10, null),
    ('Art', 'Garfunkel', 11, 10);