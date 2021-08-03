const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },
    name: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: String
    }
}, { timestamps: true });

module.exports = new mongoose.model("Chat", chatSchema);
