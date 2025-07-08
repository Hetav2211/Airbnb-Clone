const db = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(housename, price, location, rating, photo, description, id) {
    this.housename = housename;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    this.id = id;
  }

  save() {
    if (this.id) {
      // update
      return db.execute(
        "UPDATE homes SET housename=?, price=?, location=?, rating=?, photo=?, description=? WHERE id=?",
        [
          this.housename,
          this.price,
          this.location,
          this.rating,
          this.photo,
          this.description,
          this.id,
        ]
      );
    } else {
      // insert
      return db.execute(
        "INSERT INTO homes (housename, price, location, rating, photo, description) VALUES (?, ?, ?, ?, ?, ?)",
        [
          this.housename,
          Number(this.price),
          this.location,
          Number(this.rating),
          this.photo,
          this.description,
        ]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes");
  }

  static findById(homeId) {
    return db.execute("SELECT * FROM homes WHERE id = ?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("DELETE FROM homes WHERE id = ?", [homeId]);
  }
};
