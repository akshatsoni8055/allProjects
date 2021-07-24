require('dotenv').config()
var express = require('express');
var app = express.Router();
const axios = require('axios');
const { query } = require('./helper/mailer');
/* GET home page. */

app.get('/', (req, res) => {
    res.render('index', { title: 'My Projects', user: req.user });
});

app.get('/onlinetyping', (req, res) => {
    console.log(req.app.get('env'))
    res.render('onlineTyping', { title: 'Online Typing', user: req.user })
})

app.get('/weather', async (req, res) => {
    let url, response

    if (req.query.city !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=${process.env.appid}`
    } else if (req.query.zip !== undefined) {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${req.query.zip},IN&appid=${process.env.appid}`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.appid}`
    }
    try {
        response = await axios.get(url)
        res.json(response.data)
    } catch (err) {
        res.json({ cod: 404 })
    }

})

app.get('/news', async (req, res) => {

    var url = `http://api.mediastack.com/v1/news?date=${date()}&sort=published_desc&countries=in&languages=hi,en&limit=50&access_key=${process.env.newskey}`
    
    axios.get(url).then(res => res.data).then(data => { 
        res.render('news', {
            data : data.data,
            user : req.user,
            title : 'News'
        })
    })

})

app.post('/query', async (req, res) => {

    query(req.body).then(resp => {
        if (resp)
            res.send(true)
        else
            res.send(false)
    })
})

function date() {
    let today = new Date(Date())
    let prev = new Date(Date())
    prev.setDate(prev.getDate()-5)
    let pd = prev.getDate()
    let pm = prev.getMonth() + 1
    let py = prev.getFullYear()
    let d = today.getDate()
    let m = today.getMonth() + 1
    let y = today.getFullYear()

    if (`${m}`.length === 1) m = '0' + m
    if (`${d}`.length === 1) d = '0' + d
    if (`${pd}`.length === 1) pd = '0' + pd
    if (`${pm}`.length === 1) pm = '0' + pm

    return `${y}-${m}-${d},${py}-${pm}-${pd}`
}

module.exports = app;