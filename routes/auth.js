const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username, cart: "", addresses: "[]" });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
    });

    console.dir(req.user);

    res.send(registeredUser);
  })
);

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.dir(req.user);
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.error(err);
  });
  res.send({ message: "logged out" });
});

module.exports = router;
