var express = require("express");
var router = express.Router();
const successPrint = require("../helpers/debug/debugprinters").successPrint;
const errorPrint = require("../helpers/debug/debugprinters").errorPrint;
const { create } = require("../models/comments");


router.post('/create', (req, res, next) => {
    if (!req.session.username) {
        errorPrint("must be logged in to comment");
        res.json({
            code: -1,
            status: "alert",
            message: "Must be logged in to create a comment",
        })
    } else {
        let {comment, postId} = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
        create(userId, postId, comment)
        .then((wasSuccessful) => {
            if (wasSuccessful != -1) {
                successPrint(`comment was created for ${username}`);
                res.json({
                    code: 1,
                    status: "success",
                    message: "comment created",
                    comment: comment,
                    username: username
                })
            } else {
                errorPrint('comment was not saved');
                res.json({
                    code: -1,
                    status: "alert",
                    message: "Comment was not created",
    
                })
            }
        })
        .catch((err) => next(err));
    }

})



module.exports = router;