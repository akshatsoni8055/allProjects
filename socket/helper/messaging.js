const { User, Chat, Thread } = require('../../db/models')
const online = [];

// Join user to chat

async function userJoin(id, from, to) {
    let result = await Thread.findOne({ $or: [{ members: [from, to] }, { members: [to, from] }] })

    if (!result) {
        let thread = new Thread({ members: [from, to] })

        let threadId = await thread.save().then(thread => thread._id)

        User.findById({ _id: from }).then(user => {
            user.threads.push(to)
            user.save()
        })
        User.findById({ _id: to }).then(user => {
            user.threads.push(from)
            user.save()
        })

        let obj = {
            id: id,
            uid: from,
            thread: threadId
        }
        online.push(obj);
        return obj


    } else {
        let threadId = result._id
        let obj = {
            id: id,
            uid: from,
            thread: threadId
        }
        online.push(obj);
        return obj
    }

}

function saveChat(msg) {

    let chat = new Chat({
        threadId: msg.thread,
        name: msg.name,
        from: msg.from,
        to: msg.to,
        time: msg.time,
        text: msg.text
    })
    chat.save()
}


// Get current user
function getCurrentUser(uid) {
    return online.find(user => user.uid == uid);
}

// User leaves chat
function userLeave(id) {
    const index = online.findIndex(user => user.id === id);

    if (index !== -1) {
        return online.splice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    saveChat
};