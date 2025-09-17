const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    home: null,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found");
        return res.redirect("/host/host-home-list");
      }
      console.log(homeId, editing, home);
      res.render("host/edit-home", {
        home: home,
        pageTitle: "Edit Your Home",
        currentPage: "host-homes",
        editing: editing,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error finding home:", error);
      res.redirect("/host/host-home-list");
    });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { housename, price, location, rating, description } = req.body;

  // Check if file was uploaded, if not use a default photo or make it optional
  const photo = req.file ? req.file.path : "uploads/default-home.jpg";

  console.log("Form data received:", req.body);
  console.log("File received:", req.file);

  const home = new Home({
    housename,
    price,
    location,
    rating,
    photo,
    description,
  });

  home
    .save()
    .then(() => {
      console.log("Home saved successfully");
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error saving home:", error);
      res.redirect("/host/add-home?error=save_failed");
    });
};

exports.postEditHome = (req, res, next) => {
  const { housename, price, location, rating, description, id } = req.body;

  Home.findById(id)
    .then((home) => {
      home.housename = housename;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;
      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting previous photo:", err);
          }
        });
        home.photo = req.file.path;
      }
      home
        .save()
        .then((result) => {
          console.log("Home updated:", result);
        })
        .catch((error) => {
          console.log("Error while updating home:", error);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while fetching home:", error);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => console.log("Error while deleting", error));
};
