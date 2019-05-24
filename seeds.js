var mongoose=require("mongoose"),
    campGround=require("./models/campground"),
    Comment     =require("./models/comment");
var data = [
        {
            name: "Cloud's Rest", 
            image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author:{
                id : "588c2e092403d111454fff76",
                username: "Jack"
            }
        },
        {
            name: "Desert Mesa", 
            image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author:{
                id : "588c2e092403d111454fff71",
                username: "Jill"
            }
        },
        {
            name: "Canyon Floor", 
            image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            author:{
                id : "588c2e092403d111454fff77",
                username: "Jane"
            }
        }
    ]
function seedDB()
{
    //REMOVE ALL CAMPGROUNDS
    campGround.deleteMany({},(err)=>{
     if(err){
        console.log(err);
        }
        else{
        console.log("removed campgrounds");
         //ADD FEW CAMPGROUNDS
    data.forEach(function(seed){
        campGround.create(seed,(err,campground)=>{
            if(err){
                console.log(err);

            }else{
                console.log("added a campground");
                //add comment
                Comment.create({
                    title:"This place is goood but has no internet",
                    author:"Tanisha"
                },(err,comment)=>{
                    if(err){
                        console.log(err);
                    }else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("created comment")
                    }
                });
            }
        });
        
    });
        }
    });

   


    //ADD commments
}

module.exports=seedDB;