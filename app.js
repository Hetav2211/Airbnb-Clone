//core module
const path = require("path");
require("dotenv").config();

//External module
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const DB_PATH = process.env.MONGODB_URI;

//local module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtils");
const errorController = require("./controllers/error");

const { default: mongoose } = require("mongoose");
const { log } = require("console");
const { split } = require("postcss/lib/list");

const app = express();
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(express.urlencoded());
app.use(
  session({
    secret: "hetavpatel",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir, "public")));

app.use(errorController.errorHandler);

const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("connected to Mongo");

    app.listen(PORT, () => {
      console.log(`server is running at port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while connecting Mongo: ", err);
  });
