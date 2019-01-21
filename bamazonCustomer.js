const mysql = require("mysql");
const inquirer = require("inquirer");

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
    displayData();
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
                    customer();
                    break;
                case "Manager":
                    manager();
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
                console.log(`Database connected on thread: ${connection.threadId}`);

                if (res.length === 0) {
                    console.log("Item ID not valid. Enter a valid ID number.");
                    displayData();
                } else {
                    const productInfo = res[0];

                    if(quantity <= productInfo.stock_quantity){
                        console.log("Your order is being placed!");

                        const updateQuery = 'UPDATE products SET stock_quantity = ' + (productInfo.stock_quantity - quantity) + 'WHERE item_id = ' + item;

                        connection.query(updateQuery, function(err, res){
                            if(err) throw err;

                            console.log("Order has been placed!")
                            console.log("Total price is: $" + productInfo.price * quantity);
                            console.log("Thank you for shopping with Bamazon!");
                            console.log("\n-----------------------------------------------------------------\n");

                            connection.end();
                        })
                    } else {
                        console.log('Insufficient quantity in stock to proceed with order.');
					    console.log('Update order.');
					    console.log("\n---------------------------------------------------------------------\n");

					displayData();
                    }
                }
            });
        });
}

<<<<<<< HEAD
function displayData() {
    const query = 'SELECT * FROM products';

    connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Database connected on thread: ${connection.threadId}`);

            console.log("Bamazon Inventory: ");
            console.log("----------------------------------\n");

            let dataOutput = '';
            for (let i = 0; i < res.length; i++) {
                dataOutput = `
Item ID: ${res[i].item_id}
Product Name: ${res[i].product_name}
Department: ${res[i].department_name}
Price: $${res[i].price}
Quantity: ${res[i].stock_quantity} \n`;
                console.log(dataOutput);
            };
            console.log("----------------------------------\n");
        });
    };

init();
=======
init();

function displayData(data){
    console.table(data);
    // const array = [{Item_Id: data.item_id, Name: data.product_id, 
    //     Department: data.department_name,
    //     Price: data.price, Quantity: data.stock_quantity}];
    // for(let i = 0; i < data.length; i++){
    //     // const transformed = array.reduce((acc, {Item_Id, ...x}) => { 
    //     //     acc[Item_Id] = x; return acc}, {});
    //     console.table(data);
    // }

    
    // console.table(array);
}
>>>>>>> 45439a4d54dd2b84c0311ebc21802672e9a2090b
