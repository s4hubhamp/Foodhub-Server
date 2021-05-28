const express = require("express");
const router = express.Router();
const City = require("../models/city");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/:city",
  catchAsync(async (req, res) => {
    const { city } = req.params;

    const neededCity = await City.findOne({
      title: city.toLowerCase(),
    }).populate("restaurants");

    const cityRestaurants = [];
    for (const r of neededCity.restaurants) {
      cityRestaurants.push({
        title: r.title,
        description: r.description,
        image: r.image,
      });
    }
    res.send(cityRestaurants);
  })
);

module.exports = router;
