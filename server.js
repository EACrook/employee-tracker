const express = require('express');
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'C0ldD@ze',
    database : 'employee'
  });
  connection.connect();
// Run questions for command line
function askQs() {
inquirer.prompt([
    {
        type: 'list',
        name: 'selectAction',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'View all employees by manager',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Remove Employee',
            'Update Employee Role',
        ]
    }
]).then(function(answers) {

    if(answers.selectAction ==='View all employees') {
        viewEmployee()
    } else if(answers.selectAction === 'View all departments') {
        viewDepartment()
    } else if(answers.selectAction === 'View all roles') {
        viewRole()
    } else if(answers.selectAction === 'Add Department') {
        addDepartment()
    } else if(answers.selectAction === 'Add Role') {
        addRole()
    }

})
}

function addDepartment() {
    inquirer.prompt([
        {
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
        }
    ]) .then(function(answer) {
        connection.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName],
            function (error, results) {
            if (error) throw error;
            askQs()
        });
    })
}

const addRole = () => {
    connection.query('SELECT * FROM department', function (error, results) {
        if (error) throw error;
        console.table(results);
        const deptNames = []
        for (let i = 0; i < results.length; i++) {
           deptNames.push(results[i].name)
            
        }
        console.log(deptNames)

        inquirer.prompt ([
            {
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
        ]).then(function(answers) {
            console.log(answers)
            var deptId;
            for (let i = 0; i < results.length; i++) {
              if(results[i].name === answers.department) {
                  deptId = results[i].id
              }
                
            }
            console.log('ID of dept', deptId)
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.role, answers.salary, deptId],
            function (error, results) {
            if (error) throw error;
            askQs()
        });
        })



    })
} 

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

askQs()

// View all info on employees
// app.get('/api/employees', (req, res) => {
//     const sql = `SELECT * FROM candidates`;

//     db.query(sql, (err, rows) => {
//         if(err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data:rows
//         });
//     });
// });