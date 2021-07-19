const express = require('express');
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'C0ldD@ze',
    database: 'employee'
});
connection.connect();
// Run questions for command line
function askQs() {
    inquirer.prompt([{
        type: 'list',
        name: 'selectAction',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
        ]
    }]).then(function (answers) {

        if (answers.selectAction === 'View all employees') {
            viewEmployee()
        } else if (answers.selectAction === 'View all departments') {
            viewDepartment()
        } else if (answers.selectAction === 'View all roles') {
            viewRole()
        } else if (answers.selectAction === 'Add Department') {
            addDepartment()
        } else if (answers.selectAction === 'Add Role') {
            addRole()
        } else if (answers.selectAction === 'Add Employee') {
            addEmployee()
        } else if (answers.selectAction === 'Update Employee Role') {
            updateEmployeeRole()
        }

    })
}

// add a department
function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'departmentName',
        message: 'What is the department name?',
        validate: departmentName => {
            if (departmentName) {
                return true;
            } else {
                console.log('Please enter the department name!');
                return false;
            }
        }
    }]).then(function (answer) {
        connection.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName],
            function (error, results) {
                if (error) throw error;
                askQs()
            });
    });
};

// add a role
const addRole = () => {
    connection.query('SELECT * FROM department', function (error, results) {
        if (error) throw error;
        console.table(results);
        const deptNames = []
        for (let i = 0; i < results.length; i++) {
            deptNames.push(results[i].name)

        }
        console.log(deptNames)

        inquirer.prompt([{
                type: 'input',
                name: 'role',
                message: 'What is the new role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department are they in?',
                choices: deptNames
            }
        ]).then(function (answers) {
            console.log(answers)
            var deptId;
            for (let i = 0; i < results.length; i++) {
                if (results[i].name === answers.department) {
                    deptId = results[i].id
                }

            }
            console.log('ID of dept', deptId)
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.role, answers.salary, deptId],
                function (error, results) {
                    if (error) throw error;
                    askQs()
                });
        });
    })
}

// add an employee
const addEmployee = () => {
    connection.query('SELECT * FROM role', async function (error, results) {
        if (error) throw error;
        // console.table(results);
        const roleNames = [];
        for (let i = 0; i < results.length; i++) {
            roleNames.push(results[i].title)
        }
        //  console.log(roleNames)
        connection.query('SELECT * FROM employee WHERE manager_id IS null', function (error, managerResults) {
            const managerNames = [];
            for (let i = 0; i < managerResults.length; i++) {
                managerNames.push(managerResults[i].first_name);
            }

            inquirer.prompt([{
                    type: 'input',
                    name: 'first_name',
                    message: 'What is their first name?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is their last name?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is their position?',
                    choices: roleNames
                },
                {
                    type: 'list',
                    name: 'manager_name',
                    message: 'Who is their manager?',
                    choices: managerNames
                }
            ]).then(function (answers) {
                console.log(answers)
                var roleId;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answers.role) {
                        roleId = results[i].id
                    }

                }
                let managerId;
                for (let i = 0; i < managerResults.length; i++) {
                    if (managerResults[i].first_name === answers.manager_name) {
                        managerId = managerResults[i].id
                    }
                }
                console.log('ID of role', roleId)
                connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answers.first_name, answers.last_name, roleId, managerId],
                    function (error, results) {
                        if (error) throw error;
                        askQs()
                    });
            });
        });
    })
};

const addManager = async () => {
    const results = await connection.query('SELECT * FROM employee WHERE manager_id IS null', async function (error, results) {
        if (error) throw error;
        console.table('RESULTS FORM QUERY!!', results);
        return results
        // const roleNames = [];
        // for (let i = 0; i < results.length; i++) {
        //     roleNames.push(results[i].title)
        // }
        // console.log(roleNames)
    })
    return results
}

const updateEmployeeRole = () => {
    //find all employees
    connection.query('SELECT * FROM employee', function(err, empResults) {

        //find all the roles!
        connection.query('SELECT * FROM role', function(err, roleResults) {

            // do a for loop grab just the role title strings and put in a new array
            const roleTitle = [];
            for (let i = 0; i < roleResults.length; i++) {
                roleTitle.push(roleResults[i].title) 
            }
            // do a for loop grab just the emp name strings and put in a new array
            const employeeName = [];
            for (let i = 0; i < empResults.length; i++) {
                employeeName.push(empResults[i].first_name + empResults[i].last_name)                
            }
            
            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'employee_name',
                    message: 'Which employee do you want to update?',
                    choices: employeeName
                },
                {
                    type: 'list',
                    name: 'role_title',
                    message: 'What is their new role?',
                    choices: roleTitle
                }
            ]).then( function(answers) {
                var roleId;
                for (let i = 0; i < roleResults.length; i++) {
                    if (roleResults[i].title === answers.role_title) {
                        roleId = roleResults[i].id
                    }

                }
                var emplId;
                for (let i = 0; i < empResults.length; i++) {
                    if (empResults[i].first_name + empResults[i].last_name === answers.employee_name) {
                        emplId = empResults[i].id
                    }

                }
                console.log(roleId, emplId)

                connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, emplId], function(error, results) {
                    
                        if (error) throw error;
                        askQs()
                })
            })
        })
    })

  
}


// Delete employee
// const deleteDepartment = () => {


//     connection.query(`DELETE FROM department WHERE id = ?`, function(error, results) {
//         if(error) throw error;
//         console.table(results);
//         askQs()
//     });
// }

const viewEmployee = () => {
    connection.query('SELECT * FROM employee', function (error, results) {
        if (error) throw error;
        console.table(results);
        askQs()
    });
};

const viewDepartment = () => {
    connection.query('SELECT * FROM department', function (error, results) {
        if (error) throw error;
        console.table(results);
        askQs()
    });
};

const viewRole = () => {
    connection.query('SELECT * FROM role', function (error, results) {
        if (error) throw error;
        console.table(results);
        askQs()
    });
};

askQs();