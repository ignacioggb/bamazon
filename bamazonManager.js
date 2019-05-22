var mysql = require("mysql");
var inquirer = require("inquirer");


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
        choices: ["Views products for sale","View low inventory","Add to inventory","Add New Product","Exit"],
        name: "menu"
    }]).then(function (resp) {
    
        switch (resp.menu) {
            case "Views products for sale":
                forsale();
                break;
    
                case "View low inventory":
                        lowinventory();
                        break;
    
                        case "Add to inventory":
                                add();
                                break;
    
                                case "Add New Product":
                                        createproduct();
                                        break;
                                        case "Exit":
                                                break;
            default:
                break;
        }
    });

}


function forsale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        console.log("Retrieved items: " + res.length + "\n");
        for (var i = 0; i < res.length; i++) {
            console.log("id: "+res[i].item_id+" || product: "+res[i].product_name+" || Department: "+res[i].department_name
            +" || price: "+res[i].price+" || stock: "+res[i].stock_quantity)
        }
        main();
    });
}

function lowinventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        console.log("Retrieved items: " + res.length + "\n");
        for (var i = 0; i < res.length; i++) {
            console.log("id: "+res[i].item_id+" || product: "+res[i].product_name+" || Department: "+res[i].department_name
            +" || price: "+res[i].price+" || stock: "+res[i].stock_quantity)
        }
        main();
    });
}

function add(){
    
    connection.query("SELECT * FROM products", function (err, res) {
        var itemsArray=[];var list=[];
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            itemsArray.push({id:res[i].item_id,name:res[i].product_name,stock:res[i].stock_quantity});
            //list.push(i+".-id: "+res[i].item_id+" name: "+res[i].product_name+" stock: "+res[i].stock_quantity);
        }
        inquirer.prompt([{
            type: "list",
            message: "add to stock: ",
            choices: itemsArray,
            name: "addTo"
       }]).then(function (resp) {
           var selectId;var selectName;var selectStock;
           for (let i = 0; i < itemsArray.length; i++) {
            if(resp.addTo==itemsArray[i].name){
                selectId=itemsArray[i].id;
                selectName=itemsArray[i].name;
                selectStock=itemsArray[i].stock;
                console.log("\n"+itemsArray[i].name+" On existence: "+itemsArray[i].stock+"\n");}

           }
           inquirer.prompt([{type:"number",message:"add to inventory: ",name:"addItem"}]).then(function(ans){
            var newQty=parseInt(selectStock)+parseInt(ans.addItem);
            connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQty,selectId],function (err, res) {
                if (err) throw err;else{ console.log("Updated item: "+selectName+" new Qty: "+newQty+"\n")} main();});
        })
           
       });
    });


    
}

function createproduct(){

    inquirer.prompt([{type:"input",message:"product name",name:"p_name"},{type:"input",message:"department",name:"p_dpt"},
    {type:"number",message:"price",name:"p_price"},{type:"number",message:"stock Qty.",name:"p_qty"}]).then(function(ans){
    

        connection.query("INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES(?,?,?,?)", [ans.p_name,ans.p_dpt,ans.p_price,ans.p_qty],function (err, res) {
            if (err) throw err;
            console.log("new product created\n"+ans.p_name+"\n"+ans.p_dpt+"\n"+ans.p_price+"\n"+ans.p_qty+"\n");
            main();
        });

    });    
}



