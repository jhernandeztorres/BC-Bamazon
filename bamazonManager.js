const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");
const colors = require("colors");

const table = new Table({
    head: ['Item ID', "Product Name", "Price", "Quantity"],
    style: {
        head: ['red'],
        compact: false,
        colAligns: ['center']
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

function manager() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Program"]
    }).then((answers) => {
        switch (answers.choice) {
            case "View Products for Sale":
                showInfo();
                break;
            case "View Low Inventory":
                showLowStock();
                break;
            case "Add to Inventory":
                showAddInventory();
                break;
            case "Add New Product":
                showAddProduct();
                break;
            case "End Program":
                connection.end();
                return;
        }
    })
}

function showInfo() {
    displayData();
    setTimeout(manager, 500);
}

function showLowStock() {
    lowInventory();
    setTimeout(manager, 500);
}

function showAddInventory(){
    displayData();
    setTimeout(addToInventory, 500);
}

function showAddProduct(){
    displayData();
    setTimeout(addProduct, 500);
}

function lowInventory() {
    const query = 'SELECT * FROM products WHERE stock_quantity < 5';

    connection.query(query, (err, res) => {
        if (err) console.log("Error " + err);

        console.log(`Database connected on thread: ${connection.threadId}\n`);

        console.log(colors.warn(`\n
Bamazon Inventory:
--------------------------------------------------\n`));
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        };
        console.log(colors.verbose(table.toString()));
        console.log(colors.warn("----------------------------------------------------\n"));
    })
}

function addToInventory() {
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "What is the item id to update?"
    },
    {
        name: "stock_quantity",
        type: "input",
        message: "How much is being added to quantity?"
    }])
    .then((answers) => {
        let item = answers.item_id;
        let quantity = answers.stock_quantity;

        const query = 'UPDATE products SET stock_quantity = stock_quantity + '+ quantity + ' WHERE item_id = ' + item;

        connection.query(query, (err, res) => {
            if(err) console.log("Error " + err);

            console.log("Item stock quantity updated!");
            manager();
        });
    })
}

function addProduct() {
    inquirer.prompt([{
            name: "item_id",
            type: "input",
            message: "What is the item ID number?",
            validate: validate
        },
        {
            name: "product_name",
            type: "input",
            message: "What is the item product name?"
        },
        {
            name: "department",
            type: "list",
            message: "Select a department",
            choices: ["Electronics", "Home Goods", "Clothes", "Pharmacy"]
        },
        {
            name: "price",
            type: "input",
            message: "What is the item price?",
            validate: validate
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the item quantity?",
            validate: validate
        }
    ])
    .then((answers) => {
        let item = answers.item_id;
        let product = answers.product_name;
        let department = answers.department;
        let price = answers.price;
        let quantity = answers.stock_quantity;
        const query = 'INSERT INTO products SET ?';

        connection.query(query, {item_id: item, product_name: product, department_name: department, price: price, stock_quantity: quantity} ,(err, res) => {
            if(err) console.log("Error " + err);

            console.log(colors.warn("\n " + product + " product added!"));
            manager();
        })
    })
}

function displayData() {
    const query = 'SELECT * FROM products';

    connection.query(query, (err, res) => {
        if (err) console.log("Error " + err);

        console.log(`Database connected on thread: ${connection.threadId}`);

        console.log(colors.warn(`\n
Bamazon Inventory:
--------------------------------------------------\n`));
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        };
        console.log(colors.verbose(table.toString()));
        console.log(colors.warn("----------------------------------------------------\n"));
    });
};

module.exports = manager;