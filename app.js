// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

const express = require("express");
const mongoose = require("mongoose");

require("./models/recipe");
const Restaurant = require("./models/restaurant");

const authRoutes = require("./routes/auth");
const cityRoutes = require("./routes/city");
const userRoutes = require("./routes/user");
const restaurantRoutes = require("./routes/restaurants");
const ExpressError = require("./utils/ExpressError");
const bodyParser = require("body-parser");

const cors = require("cors");

const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const DBUrl = process.env.DB_URL || "mongodb://localhost:27017/foodhub";
const secret = process.env.SECRET || "foodhubSecret!";

mongoose.connect(DBUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: DBUrl || "mongodb://localhost:27017/foodhub",
    touchAfter: 24 * 3600,
  }),
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 2,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  },
};

// middlewares

app.use(
  cors({
    origin: "https://foodhub-c3fd3.web.app",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/city", cityRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/start", async (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(null);
  }
});

app.get("/mapData", async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.send({ features: restaurants });
});

app.get("/", (req, res) => {
  res.send("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  console.log(err);
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
