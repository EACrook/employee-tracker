CREATE TABLE department ( id INTEGER AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL );

CREATE TABLE role ( id INTEGER AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30) NOT NULL, salary DECIMAL NOT NULL, department_id int, FOREIGN KEY (department_id) REFERENCES department(id) );

CREATE TABLE employee ( id INTEGER AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, role_id int, manager_id int, FOREIGN KEY (role_id) REFERENCES role(id), FOREIGN KEY (manager_id) REFERENCES employee(id) ); 