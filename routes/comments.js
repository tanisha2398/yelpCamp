var express=require("express");
var router=express.Router({mergeParams:true});
var campGround  =require("../models/campground");
var Comment     =require("../models/comment");
//==============================
//COMMMENTS ROUTE
//==============================

//comment new
router.get("/new",isLoggedIn,(req,res)=>{
    campGround.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

//CREATE COMMENT
router.post("/",isLoggedIn,(req,res)=>{
    campGround.findById(req.params.id,(err,campground)=>{
        if(err){
            res.redirect("/campground")
        }else{
            Comment.create(req.body.comment,(err,newComment)=>{
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                   newComment.author.id=req.user._id;
                   newComment.author.username=req.user.username;
                    //console.log("new comment username will be:"+req.user.username);
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    console.log(newComment);
                    res.redirect("/campground/"+campground._id);
                    
                   
                }
            });
        }
    });
  
});

//middleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;