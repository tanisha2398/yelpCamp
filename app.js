var express     = require("express"),
    app         =express(),
    mongoose    =require("mongoose"), 
    bodyparser  =require("body-parser"),
    passport    =require("passport"),
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    passportLocalMongoose=require("passport-local-mongoose"),
    seedDB      =require("./seeds"),
    flash       =require("connect-flash"),
    campGround  =require("./models/campground"),
    User        =require("./models/user"),
    Comment     =require("./models/comment");
//requiring routes
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    authRoutes=require("./routes/index");
//seedDB();//seed the database
mongoose.connect("mongodb+srv://tanishanegipro:tanisha23@cluster0-y8fdu.mongodb.net/test?retryWrites=true",{
    useNewUrlParser:true,
    useCreateIndex:true}).then(() => {
        console.log('connected to DB');
    }).catch(err =>{
        console.log('ERROR:',err.message);
    });
mongoose.set('useFindAndModify', false)
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(flash());


//PASSPORT CO(NFIGURATION
app.use(require("express-session")({
    secret:"tanisha negi is best",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/",authRoutes);
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










const port = process.env.PORT || 3001;
app.listen(port ,() => {
    console.log(`Server started at port ${port}`);
});