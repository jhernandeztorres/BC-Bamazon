const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const colors = require("colors");

const table = new Table({
    head: ["Department ID", "Department Name", "Overhead Cost", "Product Sales", "Total Profit"],
    style: {
        head: ['red'],
        compact: false,
        colAligns: ['center'],
    }
})

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
})

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDb"
});

function validate(value) {
    let number = Number.isInteger(parseFloat(value));
    let sign = Math.sign(value);

    if (number && (sign === 1)) {
        return true;
    } else {
        return "Enter a number greater than 0";
    }
}

function supervisor(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "",
        choices: ["View Product Sales by Department", "Create New Department", "End Program"]
    })
    .then((answers) => {
        switch (answers.choice){
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "End Program":
                connection.end();
                return;
        }
    })
}

function viewSales(){
    const query = 'SELECT * FROM departments';

    connection.query(query, (err, res) => {
        if(err) console.log("Error " + err);

        for(let i = 0; i < res.length; i++){
            table.push([
                res[i].department_id, res[i].department_name, res[i].over_head_costs
            ])
        }
        console.log(table.toString());
        supervisor();
    })
}

function createDepartment() {
    inquirer.prompt([{
            name: "department_id",
            type: "input",
            message: "What is the department ID number?",
            validate: validate
        },
        {
            name: "department_name",
            type: "input",
            message: "What is the department name?"
        },
        {
            name: "over_head_cost",
            type: "input",
            message: "What is the over head cost for the department?",
            validate: validate
        }
    ])
    .then((answers) => {
        let departmentID = answers.department_id;
        let department = answers.department_name;
        let cost = answers.over_head_costs;
        const query = 'INSERT INTO departments SET ?';

        connection.query(query, {department_id: departmentID, department_name: department, over_head_costs: cost} ,(err, res) => {
            if(err) console.log("Error " + err);

            console.log(colors.warn("\n " + department + " department added!"));
            supervisor();
        })
    })
}

module.exports = supervisor;