const mongoose = require('mongoose')
var express = require('express');
var app = express.Router();
const { User, Chat } = require('../modals/DB')
const { isLoggedIn } = require('./auth')


app.get('', isLoggedIn, async (req, res) => {

    let userid = req.user._id

    const data = await User.findById({ _id: userid }).populate('threads')

    let inbox = data.threads.map(ix => {
        return {
            name: `${ix.fname} ${ix.lname}`,
            pic: ix.pic,
            from: req.user._id,
            to: ix._id
        }
    });

    res.render('inbox', {
        inbox: inbox,
        messages: inbox.length,
        user: req.user,
        title: 'Messages'
    })

})

app.get('/more', isLoggedIn, async (req, res) => {

    const data = await User.find({}).select({ fname: 1, lname: 1, pic: 1 })
    let inbox = []
    data.forEach(ix => {
        if (`${ix._id}` !== `${req.user._id}`)
            inbox.push({
                name: `${ix.fname} ${ix.lname}`,
                pic: ix.pic,
                from: req.user._id,
                to: ix._id
            })
    });

    res.render('inbox', {
        inbox: inbox,
        messages: inbox.length,
        user: req.user,
        title: 'All Peoples',
        more: true
    })

})



app.get('/message', isLoggedIn, async (req, res) => {
    let from = req.query.from, to = req.query.to

    if (from !== `${req.user._id}`)
        return res.redirect('/error')

    if (![from, to].every(a => mongoose.isValidObjectId(a))) {
        return res.redirect('/error')
    }

    User.findById({ _id: from }).then(from => {
        User.findById({ _id: to }).then(to => {
            if (from && to) {
                res.render('chatbox', {
                    title: 'Inbox',
                    user: req.user,
                    friend: `${to.fname} ${to.lname}`
                })
            } else {
                res.redirect('/error')
            }
        })
    })

})

app.get('/message/:threadId/:from', isLoggedIn, async (req, res) => {

    let threadId = req.params.threadId
    let from = req.params.from
    let id = req.user._id


    if (!mongoose.isValidObjectId(threadId)) {
        return res.json({})
    }

    if (`${id}` !== `${from}`) {
        return res.json({})
    }

    Chat.find({ threadId: threadId }).sort({ _id: 1 }).then(data => {
        res.json({ chats: data })
    })
})

app.get('/getdata/:id', isLoggedIn, (req, res) => {
    if (mongoose.isValidObjectId(req.params.id))
        User.findById({ _id: req.params.id }).select({ fname: 1, lname: 1, pic: 1 }).then(data => {
            res.json({
                name: `${data.fname} ${data.lname}`,
                pic: data.pic
            })
        })
})

module.exports = app