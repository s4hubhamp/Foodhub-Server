const User = require("../models/user");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/foodhub", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

async function run() {
  const id = "6058ae084edb181b9c2e11ff";
  const user = User.findByIdAndUpdate(
    id,
    { username: "shahajirao" },
    { new: true, useFindAndModify: false },
    (err,doc) => {
      console.dir(doc);
    }
  );
}

run();
