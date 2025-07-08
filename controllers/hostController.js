const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId, (home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("host/host-home-list");
    }
    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home:home,
      pageTitle: "Edit Your Home",
      currentPage: "host-homes",
      editing: editing,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  const registeredHomes = Home.fetchAll((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { housename, price, location, rating, photo } = req.body;
  const home = new Home(housename, price, location, rating, photo);
  home.save();

  res.redirect("/host/host-home-list");
};

  exports.postEditHome = (req, res, next) => {
  const { id,housename, price, location, rating, photo } = req.body;
  const home = new Home(housename, price, location, rating, photo);
  home.id = id;
  home.save();
  res.redirect("/host/host-home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.deleteById(homeId, () => {
    res.redirect("/host/host-home-list");
  });
}