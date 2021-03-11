-- Run for first time use only
-- ------------------------------------------------
DROP DATABASE IF EXISTS employees_db;

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