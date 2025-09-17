//Core module
const path = require("path");
//External module
const express = require("express");
const storeRouter = express.Router();

const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);

storeRouter.get("/homes", storeController.getHomes);

storeRouter.get("/bookings", storeController.getBookings);

storeRouter.get("/favourites", storeController.getFavouriteList);


storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

storeRouter.post("/favourites", storeController.postAddFavouriteList);

storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

storeRouter.get("favourites/homes/:homeId",storeController.getHomeDetails);


module.exports = storeRouter;
