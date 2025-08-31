//core module
const path = require("path");

//External module
const express = require("express");
//local module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtils");
const errorController = require("./controllers/error");

const { default: mongoose } = require("mongoose");
const { log } = require("console");

const app = express();
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, "public")));

app.use(errorController.errorHandler);

const PORT = 3000;
const DB_PATH =
  "mongodb+srv://root:slash@hpcluster.pyepdrb.mongodb.net/airbnb?retryWrites=true&w=majority&appName=HPcluster";

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
