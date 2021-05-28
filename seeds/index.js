const mongoose = require("mongoose");
const City = require("../models/city");
const Recipe = require("../models/recipe");
const Restaurant = require("../models/restaurant");
const user = require("../models/user");
const cities = require("./cities");
const recipes = require("./recipes");
const restaurants = require("./restaurants");

mongoose.connect("mongodb+srv://shubham:PYDisQ1aQQXhEf1F@cluster0.dnq5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedRecipes = async () => {
  //   await Recipe.deleteMany({});
  for (let i = 0; i < recipes.length; i++) {
    let price = 0;
    let type = null;
    let category = null;
    if (recipes[i].category === "quick bites") {
      category = "quick bites";
      price = Math.floor(Math.random() * 40 + 1) + 150;
    } else if (recipes[i].category === "beverages") {
      price = Math.floor(Math.random() * 20 + 1) + 40;
      category = "beverages";
    } else if (recipes[i].category === "extra") {
      price = Math.floor(Math.random() * 20 + 1) + 20;
      category = "extra";
    } else {
      price = Math.floor(Math.random() * 60 + 1) + 300;
      category = "main course";
    }

    if (recipes[i].type === "non-veg") {
      type = "non-veg";
    } else {
      type = "veg";
    }

    const recipe = new Recipe({
      title: `${recipes[i].name}`,
      category,
      type,
      price,
      image: `${recipes[i].image}`,
    });

    await recipe.save();
  }
};

const seedRestaurants = async () => {
  await Restaurant.deleteMany({});

  let q = 0;
  let b = 0;
  let m = 0;

  for (let i = 0; i < restaurants.length; i++) {
    const seededRecipes = await Recipe.find({});
    seededRecipes.sort(function (a, b) {
      return 0.5 - Math.random();
    });

    const title = restaurants[i].name.toLowerCase();

    const restaurant = new Restaurant({
      title,
      description: `${restaurants[i].desc}`,
      location: `${restaurants[i].location}`,
      city: `${restaurants[i].city}`,
      geometry: {
        type: "Point",
        coordinates: [restaurants[i].geometry[1], restaurants[i].geometry[0]],
      },
      image: `${restaurants[i].image}`,
    });

    for (let i = 0; i < seededRecipes.length; i++) {
      if (seededRecipes[i].category === "quick bites") {
        q++;
        if (q < 10) {
          restaurant.recipes.push(seededRecipes[i]);
        }
      } else if (seededRecipes[i].category === "beverages") {
        b++;
        if (b < 15) {
          restaurant.recipes.push(seededRecipes[i]);
        }
      } else if (seededRecipes[i].category === "extra") {
        restaurant.recipes.push(seededRecipes[i]);
      } else {
        m++;
        if (m < 15) {
          restaurant.recipes.push(seededRecipes[i]);
        }
      }
    }
    q = 0;
    b = 0;
    m = 0;
    await restaurant.save();
  }

  // res = await Restaurant.findById("603f38b0337a7a30283e26f4").populate(
  //   "recipes"
  // );
  // console.log(res.recipes);
};

const seedCities = async () => {
  await City.deleteMany({});
  for (let i = 0; i < cities.length; i++) {
    const seededRestaurants = await Restaurant.find({ city: cities[i] });
    
    // seededRestaurants.sort(function (a, b) {
    //     return 0.5 - Math.random();
    // });

    const title = cities[i].toLowerCase();
    const city = new City({
      title,
    });
    for (let i = 0; i < seededRestaurants.length; i++) {
      city.restaurants.push(seededRestaurants[i]);
    }
    await city.save();
  }

  //   res = await  (await City.findById("603f3c9ad900310804ba40c8").populate('restaurants'));
  //   console.log(res.restaurants[0].recipes);
};

// seedRecipes().then(() => {
//   mongoose.connection.close();
// });

// seedCities().then(() => {
//     mongoose.connection.close();
// });

// seedRestaurants().then(() => {
//     mongoose.connection.close();
// })

// async function clearUsers() {
//   await user.deleteMany({});
//   mongoose.connection.close();
// }

// clearUsers();
