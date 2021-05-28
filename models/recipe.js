const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
