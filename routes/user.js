const express = require("express");
const restaurant = require("../models/restaurant");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.use((req, res, next) => {
  // if (req.user) {
  //   return next();
  // } else {
  //   res.status(403).send("FORBIDDEN");
  // }
});

router.post(
  "/:id/updatecart",

  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { cart } = req.body;
    await User.findByIdAndUpdate(
      id,
      { cart: cart },
      { new: true, useFindAndModify: false }
    );
    res.send({ massage: "cart updated" });
  })
);

router.post(
  "/:id/updateprofile",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { email, username } = req.body;

    try {
      let user = await User.findByIdAndUpdate(
        id,
        {
          email: email,
          username: username,
        },
        { new: true, useFindAndModify: false }
      );

      await user.save();
      req.login(user, (err) => {
        if (err) return next(err);
      });

      res.send(user);
    } catch (e) {
      next(new ExpressError(e));
    }
  })
);

router.post(
  "/:id/addaddress",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { address } = req.body;

    try {
      const user = await User.findById(id);
      const addresses = JSON.parse(user.addresses);

      addresses.push(address);

      user.addresses = JSON.stringify(addresses);

      await user.save();
      res.send(user);
    } catch (e) {
      next(new ExpressError(e));
    }
  })
);

router.post(
  "/:id/addFavouriteRes",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { resId } = req.body;

    try {
      const user = await User.findById(id);

      user.favourites.push(resId);

      await user.save();
      res.send(user);
    } catch (e) {
      next(new ExpressError(e));
    }
  })
);

router.post(
  "/:id/removeFavouriteRes",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { resId } = req.body;

    try {
      const user = await User.findById(id);

      for (const [i, r] of user.favourites.entries()) {
        if (r === resId) {
          user.favourites.splice(i, 1);
        }
      }

      await user.save();
      res.send(user);
    } catch (e) {
      next(new ExpressError(e));
    }
  })
);

router.get(
  "/:id/getFavourites",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const favRes = [];

    try {
      const user = await User.findById(id);

      for (const [i, r] of user.favourites.entries()) {
        const res = await restaurant.findById(r);
        favRes.push(res);
      }

      res.send(favRes);
    } catch (e) {
      next(new ExpressError(e));
    }
  })
);

module.exports = router;
