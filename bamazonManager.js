const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const colors = require("colors");

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
    password: "root1234",
    database: "bamazonDb"
});

// Function to validate that user input is a positive number
function validate(value) {
    let number = Number.isInteger(parseFloat(value));
    let sign = Math.sign(value);

    if (number && (sign === 1)) {
        return true;
    } else {
        return "Enter a number greater than 0";
    }
}


function manager(){
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Program"]
    }).then((answers) => {
        switch (answers.choice) {
            case "View Products for Sale":

                break;
            case "View Low Inventory":

                break;
            case "Add to Inventory":

                break;
            case "Add New Product":

                break;
            case "End Program":
                connection.end();
                return;
                

        }
    })  
}


module.exports = manager;