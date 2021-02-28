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
  PRIMARY KEY(id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL, manager_id INTEGER,
  PRIMARY KEY(id)
);

-- Insert into department table
INSERT INTO department(name)
VALUES
('Engineering');

SELECT * FROM department

-- Insert into employee table
INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES
('Joseph','Soria',101,202),
('Mary','Kate',202,NULL);

SELECT * FROM employee