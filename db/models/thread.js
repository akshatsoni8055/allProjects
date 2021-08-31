const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
}, { timestamps: true })

module.exports = new mongoose.model("Thread", threadSchema);
