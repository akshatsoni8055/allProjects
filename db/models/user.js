const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    fname: String,
    lname: String,
    pic: String,
    password: String,
    token: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

module.exports = new mongoose.model("User", userSchema)
