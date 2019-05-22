var mysql = require("mysql");
var inquirer = require("inquirer");
var qty;var item;

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Xacn#1855",
    database: "bamazon"
});

connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.log("Retrieved items: " + res.length + "\n");
    for (var i = 0; i < res.length; i++) {
        console.log("id: "+res[i].item_id+" || product: "+res[i].product_name+" || Department: "+res[i].department_name
        +" || price: "+res[i].price+" || stock: "+res[i].stock_quantity)
    }
    buy();
});

    
    function buy() {
        console.log("Proceed to buy")
        inquirer.prompt([{
            type: "input",
            message: "Type item id:",
            name: "item_id"
        }]).then(function (resp) {
            item=resp.item_id;
            inquirer.prompt([{
                type: "input",
                message: "Type quantity to buy:",
                name: "item_qty"
            }]).then(function (resp2) {
                qty=resp2.item_qty;
                update();
            });
        });
    }

    function update(){
        connection.query("SELECT stock_quantity FROM products WHERE item_id=?", item, function (err, res) {
            if (err) throw err;
            if (parseInt(res[0].stock_quantity)>=qty){
                var updated_qty=res[0].stock_quantity-qty;
               connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [updated_qty, item], function (err, res) {if (err) throw err;
                connection.query("SELECT price FROM products WHERE item_id=?", item, function (err, res2) {if (err) throw err;
                    console.log("there are "+updated_qty+" units left \n Total cost: "+parseInt(res2[0].price)*parseInt(qty)+"\n Thank you for your purchase");
                    connection.end();
                });
                
                });
            }
            else {console.log("Insufficient quantity!")}

        });
    }