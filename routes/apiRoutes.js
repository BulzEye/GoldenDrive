const express = require("express");
const controller = require("../controllers/apiController");

const router = express.Router();

router.get("/allFiles", controller.get_notes)

router.get("/uploadCheck/:fileName", controller.get_uploadcheck);

router.post("/upload", controller.post_upload);

router.delete("/deletefile/:id", controller.delete_file);

router.post("/renamefile", controller.post_rename);

module.exports = router;
