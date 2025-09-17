const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  usertype: { type: String, required: true, enum: ["guest", "host"] },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});

module.exports = mongoose.model("User", userSchema);
