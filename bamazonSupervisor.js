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

main();

function main(){
    inquirer.prompt([{
        type: "list",
        message: "Menu: ",
        choices: ["View Product Sales by Department","Create New Department"],
        name: "menu"
    }]).then(function (resp) {
        switch (resp.menu) {
            case "View Product Sales by Department":
                viewSales();
                break;

                case "Create New Department":
                createNew();
                    break;
                    
                    case "Exit":
                            break;
            default:
                break;
        }
    });

}

function viewSales(){
    var query = "SELECT department_id, products.department_name,SUM(over_head_cost) AS over_head_cost,"
    query += "SUM(products_sale_column) AS products_sale_column "
    query += "FROM products INNER JOIN departments ON products.department_name = departments.department_name "
    query += "GROUP BY department_id;"

    connection.query(query, function (err, res) {
        if (err)
            throw err;

        console.log(res.length + " matches found!");

        for (var i = 0; i < res.length; i++) {
            var profit=parseFloat(res[i].products_sale_column)-parseFloat(res[i].over_head_cost);
            console.log(
                "Department id: "+ res[i].department_id+" Department name: "+res[i].department_name+" overhead costs: "+res[i].over_head_cost+" Products Sale: "+res[i].products_sale_column+" Total Profit: "+profit+" \n"
            )
        }

    });
main();
}

function createNew(){
    inquirer.prompt([{
        type: "input",
        message: "Insert new department name: ",
        name: "input"
    }]).then(function (resp) {
        connection.query("INSERT INTO departments (department_name) VALUES (?)",[resp.input], function (err, res) {
            if (err)
                throw err;});
                main();
    })

    
}