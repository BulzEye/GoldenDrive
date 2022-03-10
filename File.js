const mongoose = require("mongoose");
const { ConnectionCreatedEvent } = require("mongoose/node_modules/mongodb");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

module.exports = File;

// Fields to be added:
// - Date created, date modified
// - Size of file