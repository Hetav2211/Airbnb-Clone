const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(housename, price, location, rating, photo, description, _id) {
    this.housename = housename;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }

  save() {
    const db = getDB();
    const homeData = {
      housename: this.housename,
      price: this.price,
      location: this.location,
      rating: this.rating,
      photo: this.photo,
      description: this.description,
    };

    if (this._id && ObjectId.isValid(this._id)) {
      return db
        .collection("homes")
        .updateOne({ _id: new ObjectId(this._id) }, { $set: homeData });
    } else {
      return db.collection("homes").insertOne(homeData);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  static deleteById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
