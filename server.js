const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const File = require("./models/File");
const apiRoutes = require("./routes/apiRoutes");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(fileUpload({
    createParentPath: true
}));

app.listen(3001, () => {
    console.log("App is listening on port 3000");
});

app.use(express.urlencoded({extended: true}));

const uri = "mongodb://127.0.0.1:27017/goldendrivedb";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then((dbObj) => {
    console.log("Successfully connected to MongoDB database");
})
.catch((err) => {
    console.log("ERROR in connecting to database: " + err);
});

app.use(apiRoutes);