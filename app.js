
//jshint ejsversion: 6

const express= require("express");
const bodyParser=require("body-parser"); 
const mongoose = require("mongoose"); 
const app= express();
var item=["BMW", "FORD","Nissan"];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:  true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item({
    name: "Welcome to yur To-Do list!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});
const defaultItems =  [item1, item2, item3];

Item.insertMany(defaultItems, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Successfully Insert...");
    }
});



app.get("/", function(req, res){

    // var today= new Date();

    // var options={
    //     year:"numeric",
    //     month:"long",
    //     day:"numeric"
    // };

    var day =today.toLocaleDateString("en-US", options);

    res.render("list", {kindDay: "Today", newListItems: item});

});

app.post("/", function(req, res){
     var itemN=req.body.it1;
     
     item.push(itemN);
    console.log(item);
    
    res.redirect("/");

});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});

