const express = require("express");

const City = require("../models/city");
const Restaurant = require("../models/restaurant");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get(
  "/:restaurant",
  catchAsync(async (req, res) => {
    let { restaurant } = req.params;
    restaurant = restaurant.replace(/-/g, " ");

    const neededRes = await Restaurant.findOne({
      title: restaurant,
    }).populate("recipes");

    if (neededRes) {
      if (req.user) {
        if (req.user.favourites.includes(neededRes._id)) {
          return res.send({ ...neededRes._doc, isFavourite: true });
        }
      }
    }

    return res.send(neededRes);
  })
);

module.exports = router;
