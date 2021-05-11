var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
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

router.get('/post/:id(\\d+)', (req, res, next) => {
  //res.send({params: req.params.id});
  let baseSQL = "SELECT u.id, u.username, p.title, p.description, p.photopath, p.created \
  FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;";

  let postId = req.params.id;
  db.execute(baseSQL, [postId])
  .then(([results, fields]) => {
    if (results && results.length) {
      let post = results[0];
      res.render('imagepost', {currentPost:post});
    } else {
      req.flash('error', 'This is not the post you are looking for!');
      res.redirect('/');
    }
  })
});


router.get('/imagepost', (req, res, next) => {
  res.render("imagepost", {title: "View Post"});
});

router.get('/home', (req, res, next) => {
  res.render("home", {title: "Home"})
});

module.exports = router;
