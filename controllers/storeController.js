const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "Home",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find().populate("houseId").then((favourites) => {
    const favouriteHomes = favourites.map((fav) => fav.houseId.toString());
    res.render("store/favourite-list", {
      favouriteHomes: favouriteHomes,
      pageTitle: "Favourites",
      currentPage: "favourite-list",
    });
  });
};

exports.postAddFavouriteList = (req, res, next) => {
  const homeId = req.body.id;
  Favourite.findOne({ houseId: homeId })
    .then((fav) => {
      if (fav) {
        console.log("already marked as favourite");
        return res.redirect("/favourites");
      } else {
        fav = new Favourite({ houseId: homeId });
        fav.save().then((result) => {
          console.log("fav added", result);
        });
      }
      res.redirect("/favourites");
    })
    .catch((err) => {
      console.log("Error while making favourites", err);
    });
};

exports.postDeleteFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ houseId: homeId })
    .then((result) => {
      console.log("Fav removed:", result);
    })
    .catch((err) => {
      console.log("Error while removing favourite", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
      });
    }
  });
};
