const mongoose = require("mongoose");
const { ConnectionCreatedEvent } = require("mongoose/node_modules/mongodb");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: { // name without extension (eg: filename)
        type: String,
        required: true
    },
    fullName: { // name with extension attached (eg: filename.txt)
        type: String,
        required: true
    },
    type: { // extension (eg: .txt)
        type: String,
        required: true
    },
    size: { // size in bytes (TODO: check whether it is really in bytes or something else - CONFIRMED)
        type: Number,
        required: true
    },
    lastModified: {
        type: Date
    },
    lastModifiedMs: {
        type: Number
    }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

module.exports = File;

// Fields to be added:
// - Date created, date modified
// - Size of file