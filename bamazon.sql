CREATE DATABASE bamazonDb;

USE bamazonDb;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    stock_quantity INT NOT NULL
);

INSERT INTO products(product_name,department_name, price, stock_quantity)
VALUES ("GoFree", "electronics", 499.99, 5),
("Keyboard",  "electronics",49.99, 3),
("Monitor",  "electronics", 500.00, 4),
("Mouse", "electronics", 499.99, 10),
("Pillow", "home goods", 19.99, 40),
("Blanket", "home goods", 29.99, 30),
("T-Shirt", "clothes", 69.99, 15),
("Pants", "clothes", 59.99, 10),
("Tylenol", "pharmacy", 9.99, 20),
("Benadryl", "pharmacy", 9.99, 20)
