var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Aggregator API Jasa Marga Ver.3.3.0" });
});
//
module.exports = router;