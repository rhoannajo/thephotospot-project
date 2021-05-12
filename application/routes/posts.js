var express = require('express');
var router = express.Router();
const errorPrint = require("../helpers/debug/debugprinters.js").errorPrint;
const successPrint = require("../helpers/debug/debugprinters.js").successPrint;
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/uploads");
    },
    filename: function(req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("uploadImage"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail =`thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    /**
     * do server validation on your own
     * if any values that used for the insert statement
     * are undefined, mysql.query or execute will fail
     * with the following error:
     * BIND parameters cannot be undefined
     */

    if (!fileUploaded) {
        throw new PostError(
            "Post Failed: No file attached.",
            "/createPost",
            200
        )
    }

    if (title == "") {
        throw new PostError(
            "Post Failed: Title field left blank.",
            "/createPost",
            200
        )
    }

    if (description == "") {
        throw new PostError(
            "Post Failed: Description field left blank.",
            "/createPost",
            200
        )
    }

    if (!fk_userId) {
        throw new PostError (
            "Post Failed: Error with creating post.",
            "/createPost",
            200
        )
    }

    sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
        return PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId
        );
    })
    .then((postWasCreated) => {
        if (postWasCreated) {
            req.flash('success', "Your post was created successfully!");
            res.redirect('/');
        } else {
            throw new PostError('Post could not be created', '/postimage', 200)
        }
    })
    .catch((err) => {
        if(err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }
    })
    //db.query('', [undefined]);
});

router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                message: "No search term given",
                results: [],
            });
        } else {
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: `${results.length} results found`,
                    results: results,
                });
            } else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "No results were found for your search, but here are the 8 most recent posts.",
                    results: results,
                });
            }
        }
    } catch (err) {
        next (err);
    }
});
module.exports = router;