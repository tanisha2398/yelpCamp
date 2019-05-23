var express=require("express");
var router=express.Router();
var campGround  =require("../models/campground");
var Comment     =require("../models/comment");
//INDEX- display list of all campgrounds

router.get("/",function(req,res){
    // console.log(req.user);
     //retrieve campground from db
     campGround.find({},function(err,camps){
          if(err){
                    console.log("ERROR");
                 }
             else{
                     //console.log("ALL THE CAMPGROUNDS...........");
                      res.render("campgrounds/index",{campground:camps,currentUser:req.user});
                 }
     });
   
    
 });
 
 //NEW-display form to add new campground
 
 router.get("/new",isLoggedIn,function(req, res) {
    res.render("campgrounds/new") 
 });
 
 //CREATE- add new campground to DB
 
 router.post("/",isLoggedIn,function(req,res){
     
     var name=req.body.name;
     var image=req.body.image;
     var desc=req.body.description;
     var author={
         id:req.user._id,
         username:req.user.username
     };
     var newcampground={name:name,image:image,description:desc,author:author};
    // console.log(req.user);
     //create a new campground and save it to database
     
     campGround.create(newcampground,function(err,newlyCreated){
         if(err){
             console.log(err);
         }
         else{
             console.log("newly created");
             //redirect back to campground page
              res.redirect("/campground");
         }
     });
     
 });
 
 //SHOW-shows more info abt one campground
 
 router.get("/:id",function(req, res) {
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

//Edit campgroud
router.get("/:id/edit",(req,res)=>{
    campGround.findById(req.params.id,(err,foundCampground)=>{
        if(err){
            res.redirect("/campground");
        }else{
            res.render("campgrounds/edit",{campground:foundCampground}); 
        }
    });
  
});

//Update campground




 //middleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 module.exports=router;