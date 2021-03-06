
//jshint ejsversion: 6

const express= require("express");
const bodyParser=require("body-parser"); 
const mongoose = require("mongoose"); 
const app= express();
const dotenv = require("dotenv");

dotenv.config({
    path:"./config.env"
})



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:  true}));
app.use(express.static("public"));

mongoose.connect(
    `mongodb+srv://admin-pasindu:${process.env.DBPASSWORD}@cluster0.wonjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB`, 
{useNewUrlParser: true}).then(()=>{
    console.log("DB Connection Success.");
});

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

const listSchema={
    name: String,
    items:[itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res){

    // var today= new Date();

    // var options={
    //     year:"numeric",
    //     month:"long",
    //     day:"numeric"
    // };

    Item.find({}, function(err, foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems, function(err){
            if(err){
                console.log(err);
             }else{
                console.log("Successfully Insert...");
                res.redirect("/");
            }
});
        }else{
            res.render("list", {kindDay: "Today", newListItems: foundItems});
        }    
    })
}); 

app.get("/:customListName", function(req, res){
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
            }else{
                //show an exists list
                res.render("List", {kindDay: foundList.name, newListItems: foundList.items})
            }
        }
    });

    
});


app.post("/", function(req, res){
     const itemName=req.body.it1;
     const listName = req.body.list;


     const item = new Item({
         name: itemName
     });

     if(listName === "Today"){
            item.save();
            res.redirect("/");
     }else{
         List.findOne({name: listName}, function(err, foundList){
             foundList.items.push(item);
             foundList.save();
             re.redirect("/"+ listName);
         })
        }
     

});

app.post("/delete", function(req, res){
    const checkItemId=req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkItemId, function(err){
            if(!err){
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:checkItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }

    
    
});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});

 