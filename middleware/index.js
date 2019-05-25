var campGround=require("../models/campground");
var Comment=require("../models/comment");
//all middleware goes here

var middlewareObject={};

middlewareObject.checkCampgroundOwnership=function(req,res,next){
        //is user logged in?
        if(req.isAuthenticated()){
            
            campGround.findById(req.params.id,(err,foundCampground)=>{
                if(err){
                    req.flash("error","Campground not found");
                    res.redirect("back");
                }else{
                    //does user own the campground
                    //console.log(foundCampground.author.id);
                    //console.log(req.user._id);
                    if(foundCampground.author.id.equals(req.user._id)){
                       next(); 
                    }else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                    
                }
            });
        }else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        }
            
    
            //otherwise redirect
    
        //if not,redirect
        
    }
    

middlewareObject.checkCommentOwnership=function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(err){
                    res.redirect("back");
                }else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("back");
        }
    }
    
middlewareObject.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged in to that");
    res.redirect("/login");
}


module.exports=middlewareObject;