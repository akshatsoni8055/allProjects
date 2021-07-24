var express = require('express');
var app = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')
const { Person } = require('../modals/DB')
const { addDay } = require('./helper/hbdHelper')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/hbd/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.get('', (req, res) => {
    res.render('hbd', {
        user: req.user,
        title: "Happy Birthday"
    })
})

app.post('/upload', upload.array('files'), async function (req, res) {
    let img = []
    req.files.forEach(a => {
        img.push("/hbd/" + a.filename)
    })
    const doc = new Person({
        name: req.body.person,
        length: req.files.length,
        img: img,
        expireAt: addDay()
    })

    const result = await doc.save();

    res.json({ link: `https://akshatsoni.herokuapp.com/hbd/${result._id}` })
})

app.get('/:id', async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id))
        return res.redirect('/error')

    const result = await Person.findById({ _id: req.params.id })

    if (!result)
        return res.redirect('/error')

    res.render('caserol', { title: result.name, res: result, user: req.user })

})

module.exports = app;
