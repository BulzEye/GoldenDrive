const express = require("express");
const mongoose = require("mongoose");

const app = express();

const uri = "mongodb://127.0.0.1:27017/goldendrivedb";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then((dbObj) => {
    console.log("Successfully connected to MongoDB database");
})
.catch((err) => {
    console.log("ERROR in connecting to database: " + err);
});




