const mongoose = require('mongoose');
const User = require('../models/user')
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


async function start() {
    try {
        // const user = new User({
        //     username: 'shubham_cool',
        //     email: 'fsd@fsd.comfsa',
        //     password: 'fsds',
        //     addresss: [{
        //         address: 'pawarnagar',
        //         city: 'Sangli',
        //         address_type: 'work',
        //         flat_no: 3
        //     }]
        // });
        //
        // await user.save()

        const user = await User.findById("606c504f945e88290c5a0bae");
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        console.dir(user.addresses)
    } catch (e) {
        console.dir(e)
    }

}


start();
