//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expres.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
    name: String
}
const item1=newItem({
    name: "Welcome to your todolist!"
});
const item1=newItem({
    name: "To add new item, hit +"
});
const item1=newItem({
    name: "<--, By this, You can mark the task as complete"
});
const defaultItems=[item1,item2,item3];

const listSchema={
    name: String,
    items: [itemsSchema]
}
const List=mongoose.model("list",listSchema);

app.get("/",function(req,res){
    Items.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved default items to DB");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle: "Today", newListItems:foundItems});
        }
    });
});

app.get("/:customListName", function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list=new List({
                    name:customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
        }
    });
});

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item=new Item({
        name:itemName
    });
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if (!err) {
              console.log("Successfully deleted checked item.");
              res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if (!err){
              res.redirect("/" + listName);
            }
        }); 
    }
})

app.get("/about", function(req, res){
    res.render("about");
  });
  
app.listen(3000, function() {
    console.log("Server started on port 3000");
});