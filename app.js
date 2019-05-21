var express     = require("express"),
    app         =express(),
    mongoose    =require("mongoose"), 
    bodyparser  =require("body-parser"),
    seedDB      =require("./seeds"),
    campGround  =require("./models/campground");
    Comment     =require("./models/comment");
seedDB();
mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));

//SCHEMA SETUP


// campGround.create(
//             {
//                 name:"Badoli-2",
//                 image:"https://farm5.staticflickr.com/4298/36041654986_53f1d04a4e.jpg",
//                 description:"this is beautiful place for camp with No water"
                
//             },function(err,camp){
//                         if(err){
//                             console.log("ERROR");
//                         }
//                         else{
//                             console.log("camp is saved to DB");
//                             console.log(camp);
//                         }
//                     });



app.get("/",function(req,res){
    res.render("landing");
});

//INDEX- display list of all campgrounds

app.get("/campground",function(req,res){
    
    //retrieve campground from db
    campGround.find({},function(err,camps){
         if(err){
                   console.log("ERROR");
                }
            else{
                    //console.log("ALL THE CAMPGROUNDS...........");
                     res.render("campgrounds/index",{campground:camps});
                }
    });
  
   
});

//NEW-display form to add new campground

app.get("/campground/new",function(req, res) {
   res.render("campgrounds/new") 
});

//CREATE- add new campground to DB

app.post("/campground",function(req,res){
    
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newcampground={name:name,image:image,description:desc};
    //create a new campground and save it to database
    
    campGround.create(newcampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campground page
             res.redirect("/campground");
        }
    });
    
});

//SHOW-shows more info abt one campground

app.get("/campground/:id",function(req, res) {
    //find campground with provided ID
    campGround.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
           // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });

});


//==============================
//COMMMENTS ROUTE
//==============================
app.get("/campground/:id/comments/new",(req,res)=>{
    campGround.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

//CREATE COMMENT
app.post("/campground/:id/comments",(req,res)=>{
    campGround.findById(req.params.id,(err,campground)=>{
        if(err){
            res.redirect("/campground")
        }else{
            Comment.create(req.body.comment,(err,newComment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campground/"+campground._id);
                    
                   
                }
            });
        }
    });
  
});
const port = 3001;
app.listen(port ,() => {
    console.log(`Server started at port ${port}`);
});