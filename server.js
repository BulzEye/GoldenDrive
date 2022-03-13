const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const File = require("./File");
const fs = require("fs");

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

app.get("/allFiles", (req, res) => {
    File.find()
    .then((files) => {
        res.json(files);
    })
    .catch((err) => {
        console.log("ERROR in displaying files");
        res.status(404).send("Could not find files");
    });
})

app.get("/uploadCheck/:fileName", (req, res) => {
    const toCheckName = req.params.fileName;
    File.findOne({name: toCheckName}, (err, file) => {
        console.log(file);
        if(file) {
            console.log("Not unique");
            res.json({isUnique: false});
        }
        else {
            console.log("Unique");
            res.json({isUnique: true});
        }
    })
});

app.post("/upload", (req, res) => {
    console.log(req.body);
    console.log(req.body.shouldDuplicate);
    console.log(req.files);
    let filerec = req.files.myFile;
    let fileName = filerec.name.substring(0, filerec.name.lastIndexOf("."));
    let fileType = filerec.name.substring(filerec.name.lastIndexOf("."));
    // console.log(filerec);
    let pathname = __dirname + "/files/" + filerec.name;
    if(req.body.shouldDuplicate === "true") {
        console.log("We will duplicate");
        File.find({name: {$regex: new RegExp(`${fileName} \\([0-9]+\\)${fileType}`)}}, (err, files) => {
            console.log(files);
            console.log(files.length);
            if(err) console.log(`ERROR: ${err}`);

            // Save file with new filename (that has a number added to it)
            let newFileName = `${fileName} (${files.length + 1})${fileType}`;
            console.log(newFileName);
            filerec.mv(__dirname + "/files/" + newFileName, (err) => {
                if(err) {
                    console.log(`ERROR: ${err}`);
                }
                else {
                    console.log(`Saved file at ${pathname}`);
                    console.log(filerec.name);
                    const file = new File({
                        name: newFileName,
                        type: filerec.name.substring(filerec.name.lastIndexOf(".")),
                        size: filerec.size
                    });
                    file.save()
                    .then(() => {
                        console.log("File saved in db");
                        // res.json({status: "File saved in db"});
                    })
                    .catch((err) => {
                        console.log(`ERROR in saving to db: ${err}`);
                    });
                }
            });
        });
    }
    else if(req.body.shouldDuplicate === "false") {
        console.log("We will replace");
        File.findOneAndDelete({name: filerec.name}, (err, file) => {
            if(err) console.log(`ERROR: ${err}`);
            filerec.mv(pathname, (err) => {
                if(err) {
                    console.log(`ERROR: ${err}`);
                }
                else {
                    console.log(`Saved file at ${pathname}`);
                    console.log(filerec.name);
                    const file = new File({
                        name: filerec.name,
                        type: filerec.name.substring(filerec.name.lastIndexOf(".")),
                        size: filerec.size
                    });
                    file.save()
                    .then(() => {
                        console.log("File saved in db");
                        // res.json({status: "File saved in db"});
                    })
                    .catch((err) => {
                        console.log(`ERROR in saving to db: ${err}`);
                    });
                }
            });
        });

    }
    else {
        filerec.mv(pathname, (err) => {
            if(err) {
                console.log(`ERROR: ${err}`);
            }
            else {
                console.log(`Saved file at ${pathname}`);
                console.log(filerec.name);
                const file = new File({
                    name: filerec.name,
                    type: filerec.name.substring(filerec.name.lastIndexOf(".")),
                    size: filerec.size
                });
                file.save()
                .then(() => {
                    console.log("File saved in db");
                    // res.json({status: "File saved in db"});
                })
                .catch((err) => {
                    console.log(`ERROR in saving to db: ${err}`);
                });
            }
        });
    }
    // TODO: add section for detecting duplicate files

    // filerec.mv(pathname, (err) => {
    //     if(err) {
    //         console.log(`ERROR: ${err}`);
    //     }
    //     else {
    //         console.log(`Saved file at ${pathname}`);
    //         console.log(filerec.name);
    //         const file = new File({
    //             name: filerec.name,
    //             type: filerec.name.substring(filerec.name.lastIndexOf(".")),
    //             size: filerec.size
    //         });
    //         file.save()
    //         .then(() => {
    //             console.log("File saved in db");
    //             // res.json({status: "File saved in db"});
    //         })
    //         .catch((err) => {
    //             console.log(`ERROR in saving to db: ${err}`);
    //         });
    //     }
    // });
    res.send("Received file!<br /><a href=\"/\">Return Home</a>");
});

app.delete("/deletefile/:id", (req, res) => {
    const id = req.params.id;
    File.findByIdAndDelete(id)
    .then((result) => {
        console.log(result);
        fs.unlink(`${__dirname}/files/${result.name}`, err => {
            if(err) {
                console.log("ERROR in deleting file from file system: " + err);
                res.json({success: false});
            }
            else {
                console.log("Deleted file from filesystem");
                res.json({success: true});
            }
        });
    })
    .catch((err) => {
        console.log(`ERROR in deleting file record: ${err}`);
        res.json({success: false});
    });
})


