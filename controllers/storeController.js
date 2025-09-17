const Home = require("../models/home");
const User = require("../models/user");

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getIndex = (req, res, next) => {
  console.log("session:", req.session.isLoggedIn);

  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "Favourites",
    currentPage: "favourite-list",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddFavouriteList = async (req, res, next) => {
  try {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect("/login");
    }

    if (user.favourites.includes(homeId)) {
      console.log("already marked as favourite");
      return res.redirect("/favourites");
    } else {
      user.favourites.push(homeId);
      await user.save();
      console.log("fav added", homeId);
    }
    res.redirect("/favourites");
  } catch (error) {
    console.log("Error adding to favourites:", error);
    res.redirect("/favourites");
  }
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect("/login");
    }

    user.favourites = user.favourites.filter(
      (favId) => favId.toString() !== homeId
    );
    await user.save();
    console.log("Favourite removed:", homeId);
    res.redirect("/favourites");
  } catch (error) {
    console.log("Error while removing favourite:", error);
    res.redirect("/favourites");
  }
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
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    } 
  });
};
