const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

const app = express();

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

app.post("/upload", (req, res) => {
    // console.log(req.body);
    // console.log(req.files);
    let filerec = req.files.myFile;
    // console.log(filerec);
    let pathname = __dirname + "/files/" + filerec.name;
    filerec.mv(pathname, (err) => {
        if(err) {
            console.log(`ERROR: ${err}`);
        }
        else {
            console.log(`Saved file at ${pathname}`);
        }
    });
    res.send("Received file!<br /><a href=\"/\">Return Home</a>");
});


