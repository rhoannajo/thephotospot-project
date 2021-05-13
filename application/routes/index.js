var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
//var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
const {getRecentPosts, getPostById, getCommentsByPostId}  = require('../middleware/postsmiddleware');
var db = require("../conf/database");

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render("index", {title: "The Photo Spot"});
});

router.get('/login', (req, res, next) => {
  res.render("login", {title: "User Login"});
});

router.get('/registration', (req, res, next) => { 
  res.render("registration", {title: "Registration"});
});

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req, res, next) => {
  res.render("postimage", {title: "Create a Post"});
});

router.get('/posts/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
  res.render("imagepost", {title: `Post ${req.params.id}`});
});


router.get('/imagepost', (req, res, next) => {
  res.render("imagepost", {title: "View Post"});
});

router.get('/home', (req, res, next) => {
  res.render("home", {title: "Home"})
});

module.exports = router;
