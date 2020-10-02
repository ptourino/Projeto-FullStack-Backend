const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");

app.use(cors());

let id = "";



app.post("/upload/:id", function (req, res) {
  id = req.params.id;
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "songsDB");
  },
  filename: function (req, file, cb) {
    cb(null, id + ".mp3");
  },
});

var upload = multer({ storage: storage }).single("file");

app.listen(7999, function () {
  console.log("App running on port 7999");
});