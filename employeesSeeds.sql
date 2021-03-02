-- Create and use database
CREATE DATABASE employees_db;

USE employees_db;

-- Create tables
CREATE TABLE department(
id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE role(
id INTEGER AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INTEGER NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_department
  FOREIGN KEY (department_id) 
  REFERENCES department(id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL, manager_id INTEGER,
PRIMARY KEY(id),
CONSTRAINT fk_role
FOREIGN KEY (role_id)
	REFERENCES role(id)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
CONSTRAINT fk_manager
FOREIGN KEY (manager_id)
	REFERENCES role(id)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);

-- Insert into department table
INSERT INTO department(name)
VALUES
('Engineering'),
('Project Managment'),
('Supply Chain Management'),
('Operations'),
('Quality');

SELECT * FROM department

-- View Departments

SELECT * FROM department

-- Insert into role table
INSERT INTO role(title,salary,department_id)
VALUES
('ROLE','SALARY','ID OF DEPARTMENT FROM DEPARTMENT TABLE'),


SELECT * FROM employee

-- Insert into employee table
INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES
('FIRST NAME','LAST NAME','ID OF EMPLOYEE FROM ROLE TABLE','ID OF MANAGER FROM ROLE TABLE'),

SELECT * FROM employee;

-- Deleting employees using parent role table
DELETE FROM role
WHERE id = 'INSERT ID OF EMPLOYEE TO DELETE; UPDATES EMPLOYEE TABLE';

-- Updating salaries using role table
UPDATE role
SET salary = 'INSERT NEW NUMBER'
WHERE id = 'ENTER ID NUMBER FROM ROLE TABLE HERE';

-- Display employees by department
SELECT 
	first_name,
	last_name,
	department.name
FROM employee e
INNER JOIN 
	role r ON (e.role_id = r.id)
INNER JOIN
	department ON (r.department_id = department.id)
WHERE department_id = 'ENTER DEPARTMENT ID HERE'; 

-- Display employees by Manager
SELECT 
	first_name,
	last_name,
	r.title,
	department.name
FROM employee e
INNER JOIN 
	role r ON (e.role_id = r.id)
INNER JOIN
	department ON (r.department_id = department.id)
WHERE department_id = 'ENTER DEPARTMENT ID HERE'; 