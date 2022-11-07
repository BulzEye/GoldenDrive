const File = require("../models/File");
const fs = require("fs");

const fileDir = __dirname.substring(0, __dirname.indexOf("\\controllers")) + "/files/";

module.exports.get_notes = (req, res) => {
    File.find()
    .then((files) => {
        res.json(files);
    })
    .catch((err) => {
        console.log("ERROR in displaying files");
        res.status(404).send("Could not find files");
    });
};

module.exports.get_uploadcheck = (req, res) => {
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
};

module.exports.post_upload = (req, res) => {
    console.log(__dirname);
    console.log(fileDir);

    console.log(req.body);
    console.log(req.body.shouldDuplicate);
    console.log(req.files);
    let filerec = req.files.myFile;
    let fileName = filerec.name.substring(0, filerec.name.lastIndexOf("."));
    let fileType = filerec.name.substring(filerec.name.lastIndexOf("."));
    let pathname = fileDir + filerec.name;
    // console.log(filerec);

    if(req.body.shouldDuplicate === "true") {
        console.log("We will duplicate");
        File.find({name: {$regex: new RegExp(`${fileName} \\([0-9]+\\)${fileType}`)}}, (err, files) => {
            console.log(files);
            console.log(files.length);
            if(err) console.log(`ERROR: ${err}`);

            // Save file with new filename (that has a number added to it)
            let newFileName = `${fileName} (${files.length + 1})`;
            console.log(newFileName);
            filerec.mv(fileDir + newFileName, (err) => {
                if(err) {
                    console.log(`ERROR: ${err}`);
                }
                else {
                    console.log(`Saved file at ${pathname}`);
                    console.log(filerec.name);
                    const file = new File({
                        name: newFileName,
                        fullName: `${newFileName}${fileType}`,
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
                        name: fileName,
                        fullName: filerec.name,
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
                    name: fileName,
                    fullName: filerec.name,
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
};

module.exports.delete_file = (req, res) => {
    const id = req.params.id;
    File.findByIdAndDelete(id)
    .then((result) => {
        console.log(result);
        fs.unlink(`${fileDir}${result.fullName}`, err => {
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
};

// TODO: test renaming, after MVC restructure
module.exports.post_rename = (req, res) => {
    const id = req.body.id;
    const newName = req.body.newFileName;
    
    File.findById(id)
    .then((file) => {
        const newFullName = newName + file.type;
        fs.rename(`${fileDir}${file.fullName}`, `${fileDir}${newFullName}`, (err) => {
            if(err) {
                console.log(`ERROR in renaming file in filesystem: ${err}`);
                res.status(404).send({error: err});
            }
            console.log("Renamed file in filesystem");
            file.name = newName;
            file.fullName = newFullName;
            File.findByIdAndUpdate(id, file, {new: true})
            .then((resFile) => {
                console.log("Renamed file in database");
                res.json(resFile);
            })
            .catch((err) => {
                console.log(`ERROR in renaming file in database: ${err}`);
                res.status(404).json({error: err});
            })

        })
    })
    .catch((err) => {
        console.log(`ERROR in finding file: ${err}`);
        res.status(404).json({error: err});
    })
};

module.exports.get_downloadfile = (req, res) => {
    const id = req.params.id;
    File.findById(id)
    .then((file) => {
        const filepath = fileDir + file.fullName;
        res.download(filepath, (err) => {
            if(err) console.log(err);
        });
    })
    .catch((err) => {
        console.log(`ERROR in fetching file from database for download: ${err}`);
    })
}