var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
  res.render("landing");
});

//=======================
//AUTHENTICATION ROUTE
//========================

//show register form
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});
//handle sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function() {
      req.flash(
        "success",
        "Successfully Signed Up! Welcome to YelpCamp " + user.username
      );
      res.redirect("/campground");
    });
  });
});

//show login form
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});
//handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);
//add logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campground");
});

module.exports = router;
