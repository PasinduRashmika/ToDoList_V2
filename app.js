
//jshint ejsversion: 6

const express= require("express");
const bodyParser=require("body-parser"); 

const app= express();
var item=["BMW", "FORD","Nissan"];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:  true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    var today= new Date();

    var options={
        year:"numeric",
        month:"long",
        day:"numeric"
    };

    var day =today.toLocaleDateString("en-US", options);

    res.render("list", {kindDay: day, newListItems: item});

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

