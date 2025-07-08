const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtils");

const favouriteDataPath = path.join(rootDir, "data", "favourite.json");

module.exports = class Favourite {
  static addToFavourite(homeId, callback) {
    Favourite.getFavourite((favourites) => {
      if (favourites.includes(homeId)) {
        callback("Home is already marked favourite");
      } else {
        favourites.push(homeId);
        fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
      }
    });
  }
  static getFavourite(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      if (err) {
        return callback([]);
      }
      try {
        const favourites = JSON.parse(data);
        callback(favourites);
      } catch (parseError) {
        callback([]);
      }
    });
  }

  static deleteById(delhomeId, callback) {
    Favourite.getFavourite((homeIds) => {
      homeIds = homeIds.filter((homeId) => delhomeId !== homeId);
      fs.writeFile(favouriteDataPath, JSON.stringify(homeIds), callback);
    });
  }
};
