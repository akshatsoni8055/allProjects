'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let uri
if (config.use_env_variable) {
    uri = process.env[config.use_env_variable]
} else {
    uri = config.DATABASE_URI
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => console.log(error));


fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        db[model.modelName] = model;
    });


module.exports = db
