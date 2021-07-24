const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: Array
}, { timestamps: true, expires: '24h' });


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

const threadSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
}, { timestamps: true })

const Person = mongoose.model("Person", personSchema)
const Chat = mongoose.model("Chat", chatSchema);
const Thread = mongoose.model("Thread", threadSchema);
const User = mongoose.model("User", userSchema)

module.exports = { Person, Chat, Thread, User }