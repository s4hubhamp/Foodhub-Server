const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const RestaurantSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  opts
);

RestaurantSchema.virtual("properties.popUpMarkup").get(function () {
  return `<div class="card" style="max-width: 250px;">
  <img src="${this.image}" class="card-img-top" alt="${this.title}" style="max-height: 140px;">
  <div class="card-body">
  <h5 class="card-title"><strong>${this.title}</strong></h5>
  <p class="card-text">${this.description}</p>
  <p class="card-text text-muted">${this.location}</p>
  </div></div>
  `;
});

RestaurantSchema.virtual("properties.city").get(function () {
  return this.city;
});

RestaurantSchema.virtual("properties.restaurant").get(function () {
  return this.title;
});
module.exports = mongoose.model("Restaurant", RestaurantSchema);
