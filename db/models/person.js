const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: Array
}, { timestamps: true, expires: '24h' });

module.exports = new mongoose.model("Person", personSchema)
