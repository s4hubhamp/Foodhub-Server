const mongoose = require('mongoose');
const Restaurant = require('./restaurant');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    title:{
        type:String,
        required:true
    },
    restaurants:[
        {
            type:Schema.Types.ObjectId,
            ref:'Restaurant'
        }
    ]

});

module.exports = mongoose.model('City',CitySchema);