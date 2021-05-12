var express = require("express");
var router = express.Router();
const successPrint = require("../helpers/debug/debugprinters").successPrint;
const errorPrint = require("../helpers/debug/debugprinters").errorPrint;
const { create } = require("../models/comments");


router.post('/create', (req, res, nest) => {
    console.log(req.body);
    res.json("We got your comment");
})



module.exports = router;