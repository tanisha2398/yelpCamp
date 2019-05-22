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
 
 router.get("/new",function(req, res) {
    res.render("campgrounds/new") 
 });
 
 //CREATE- add new campground to DB
 
 router.post("/",function(req,res){
     
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
 module.exports=router;