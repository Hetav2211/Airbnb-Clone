const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtils");
const Favourite = require("./favourite");

const homeDataPath = path.join(rootDir, "data", "homes.json");

module.exports = class Home {
  constructor(housename, price, location, rating, photo) {
    this.housename = housename;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      if (this.id) {
        // edit home case
        registeredHomes = registeredHomes.map((home) =>
          home.id === this.id ? this : home
        );
      } else {
        // add home case
        this.id = Math.random().toString();
        registeredHomes.push(this);
      }

      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
        console.log("File Writing Concluded", error);
      });
    });
  }
  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      if (!err) {
        callback(JSON.parse(data));
      } else {
        callback([]);
      }
    });
  }

  static findById(homeId, callback) {
    this.fetchAll((homes) => {
      const homeFound = homes.find((home) => home.id === homeId);
      callback(homeFound);
    });
  }

  static deleteById(homeId, callback) {
    this.fetchAll((homes) => {
      const updatedHomes = homes.filter((home) => home.id !== homeId);
      fs.writeFile(homeDataPath, JSON.stringify(updatedHomes), (error) => {
        Favourite.deleteById(homeId, callback);
      });
    });
  }
};
