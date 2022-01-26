const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

module.exports = File;