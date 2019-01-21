const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDb"
});

// Function to start database connection
function startConnection(){
    connection.connect(function(err){
        if(err) throw err;
        console.log(`Database connected on thread: ${connection.threadId}`);
    });
}

// FUnction to close database connection
function closeConnection(){
    connection.end();
    console.log("Information retrieved. Have a good day!");
};

// Function to welcome user and ask what account they will be using
function init(){
    inquirer.prompt({
        name: "welcome",
        message: `Welcome to Bamazon Services!
The greatest selection of almost everything in the world!
Which user are you?`,
        type: "list",
        choices: ["Customer", "Manager", "Supervisor", "End Program"]
    })
    .then((data) =>{
        switch (data.welcome){
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
function customer(){
    startConnection();
    connection.query('SELECT * FROM products', (err, res) => {
        if(err){
            console.log("There was an error.");
        }
        displayData(res);
        closeConnection();
        inquirer.prompt([{
            name: "buy",
            type: "input",
            message: "What is the Item Id of the product you would like to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many of that product would you like to buy?"
        }])
        .then((answer) => {
            let productId = answer.buy;
            let productQuantity = answer.quantity;
            let productPrice ;
            let priceUpdate ;
            if(!res[productId - 1].price){
                productPrice = "That item is not in stock or there is insufficient quantity.";
                priceUpdate = "That item is not in stock or there is insufficient quantity.";
            } else {
                productPrice = res[productId - 1].price;
                priceUpdate = res[productId - 1].price * productQuantity;
            }
            
            let userChoice = `
You have chosen:
Name: ${res[productId - 1].product_name}
Price: ${productPrice}
Quantity: ${productQuantity}
\n
New Price: ${priceUpdate}`;
            if((productId - 1 ) < 0 || (productId - 1 ) > res[9].item_id && productQuantity < res[productId - 1].stock_quantity || productQuantity > res[productId - 1].stock_quantity){
                userChoice = "That item is not in stock or there is insufficient quantity.";
            }
                console.log(userChoice);
        });
    });
}

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
