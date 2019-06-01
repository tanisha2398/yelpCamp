var express = require("express");
var router = express.Router();
var campGround = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// google map
var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

//INDEX- display list of all campgrounds

router.get("/", function(req, res) {
  // console.log(req.user);
  //retrieve campground from db
  campGround.find({}, function(err, camps) {
    if (err) {
      console.log("ERROR");
    } else {
      //console.log("ALL THE CAMPGROUNDS...........");
      res.render("campgrounds/index", {
        campground: camps,
        currentUser: req.user,
        page: "campgrounds"
      });
    }
  });
});

//NEW-display form to add new campground

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

//CREATE- add new campground to DB

router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;

    var newcampground = {
      name: name,
      price: price,
      image: image,
      description: desc,
      author: author,
      location: location,
      lat: lat,
      lng: lng
    };
    // console.log(req.user);
    //create a new campground and save it to database

    campGround.create(newcampground, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        //redirect back to campground page
        console.log(newlyCreated);
        res.redirect("/campground");
      }
    });
  });
});

//SHOW-shows more info abt one campground

router.get("/:id", function(req, res) {
  //find campground with provided ID
  campGround
    .findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Edit campgroud
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  //is user logged in?

  campGround.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//Update campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    campGround.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          req.flash("error", err.message);
          res.redirect("back");
        } else {
          req.flash("success", "Successfully Updated!");
          res.redirect("/campground/" + req.params.id);
        }
      }
    );
  });
});
//destroy campground route

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  campGround.findByIdAndDelete(req.params.id, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campground");
    }
  });
});

module.exports = router;
