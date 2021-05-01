var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;

/* GET home page. */
router.get('/', function(req, res, next) {
  //next(new Error('test'));
  res.render("index", {title: "Welcome"});
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

router.get('/imagepost', (req, res, next) => {
  res.render("imagepost", {title: "View Post"});
});

router.get('/home', (req, res, next) => {
  res.render("home", {title: "Home"})
});

module.exports = router;
