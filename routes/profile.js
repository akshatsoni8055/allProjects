require('dotenv').config()
var express = require('express');
var app = express.Router();
var { isLoggedIn } = require('./auth')
const { User } = require('../modals/DB')
const bcrypt = require('bcrypt')


app.get('', isLoggedIn, function (req, res) {
  res.render('profile', {
    user: req.user,
    title: `${req.user.fname} ${req.user.lname}`,
  })
});


app.post('', isLoggedIn, async (req, res) => {
  let id = req.user._id
  let user = await User.findById({ _id: id })
  let isTrue = false
  user.fname = req.body.fname
  user.lname = req.body.lname
  if (req.body.npassword.trim() !== '') isTrue = await bcrypt.compare(req.body.opassword, user.password)
  if (isTrue) user.password = await bcrypt.hash(req.body.npassword, 10)
  user.save()

  req.user = user
  return res.render('profile', {
    user: req.user,
    title: `${req.user.fname} ${req.user.lname}`,
  })
})

module.exports = app;