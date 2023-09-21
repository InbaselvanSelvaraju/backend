const mongoose = require("mongoose")

const productSchema = new  mongoose.Schema({
    title : String,
    manufacturer : String,
    discription : String,
    price : Number,
    creationAt : Date,
    updateAt : Date,
})

const products = mongoose.model("products", productSchema)


module.exports = products