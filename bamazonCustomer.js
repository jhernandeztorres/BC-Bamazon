const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const colors = require("colors");
const Manager = require("./bamazonManager.js");

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

// Function to welcome user and ask what account they will be using
function init() {
    inquirer.prompt({
            name: "welcome",
            message: `Welcome to Bamazon Services!
The greatest selection of almost everything in the world!
Which user are you?`,
            type: "list",
            choices: ["Customer", "Manager", "Supervisor", "End Program"]
        })
        .then((data) => {
            switch (data.welcome) {
                case "Customer":
                    showInfo();
                    break;
                case "Manager":
                    Manager();
                    break;
                case "Supervisor":
                    supervisor();
                    break;
                case "End Program":
                    connection.end();
                    return;
            }
        })
}

// Function to breakup the asynchronous portion of inquirer and display data
function showInfo(){
    displayData();
    setTimeout(customer, 2000);
}

// Function that runs the customer facing prompts
function customer() {
    inquirer.prompt([{
                name: "item_id",
                type: "input",
                message: "What is the Item Id of the product you would like to buy?",
                validate: validate

            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many of that product would you like to buy?",
                validate: validate
            }
        ])
        .then((answer) => {
            let item = answer.item_id;
            let quantity = answer.stock_quantity;
            let query = 'SELECT * FROM products WHERE ?';

            connection.query(query, ({item_id: item}), (err, res) => {
                if (err) throw err;
                console.log(`\n
Database connected on thread: ${connection.threadId}`);

                if (res.length === 0) {
                    console.log(colors.error("Item ID not valid. Enter a valid ID number."));
                    customer();
                } else {
                    const productInfo = res[0];

                    if(quantity <= productInfo.stock_quantity){
                        console.log(colors.error("Your order is being placed!"));

                        const updateQuery = `UPDATE products SET stock_quantity = ${productInfo.stock_quantity - quantity} WHERE item_id =  + ${item}`;

                        connection.query(updateQuery, function(err, res){
                            if(err) throw err;

                            console.log(colors.info(`
Order has been placed!
Total price is: $${productInfo.price * quantity}
Thank you for shopping with Bamazon!
\n-----------------------------------------------------------------\n`));

                            tryAgain();
                        })
                    } else {
                        console.log(colors.error(`\n
Insufficient quantity in stock to proceed with order.
Update order.
\n---------------------------------------------------------------------\n`));

					customer();
                    }
                }
            });
        });
}

function tryAgain(){
    inquirer.prompt([{
        name: "question",
        type: "list",
        message: "Would you like to buy another item or end program?",
        choices: ["Buy", "End Program"]

    }])
    .then((answer) => {
        switch (answer.question){
            case "Buy":
                init();
                break;
            case "End Program":
                connection.end();
                return;
        }
    })
};

function displayData() {
    const query = 'SELECT * FROM products';

    connection.query(query, (err, res) => {
            if (err) throw err;
            const table = new Table({
                head: ['Item ID', "Product Name", "Price", "Quantity"],
                style: {
                    head: ['red'],
                    compact: false,
                    colAligns: ['center']
                }
            })
            console.log(`Database connected on thread: ${connection.threadId}`);

            console.log(colors.warn(`\n
Bamazon Inventory:
--------------------------------------------------\n`));
//             let dataOutput = '';
            for (let i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
                );
                // console.log(colors.verbose(table.toString()));
//                 dataOutput = `
// Item ID: ${res[i].item_id}
// Product Name: ${res[i].product_name}
// Department: ${res[i].department_name}
// Price: $${res[i].price}
// Quantity: ${res[i].stock_quantity} \n`;
//                 console.log(dataOutput);
            };
            console.log(colors.verbose(table.toString()));
            console.log(colors.warn("----------------------------------------------------\n"));
        });
    };

init();
