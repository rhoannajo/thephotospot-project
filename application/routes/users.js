var express = require('express');
var router = express.Router();
var db = require('../conf/database')

var errorPrint = require("../helpers/debug/debugprinters.js").errorPrint;
var successPrint = require("../helpers/debug/debugprinters.js").successPrint;
var UserError = require("../helpers/error/UserError.js");

var bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpass = req.body.confirmpass;

  if (username.length < 3) {
    throw new UserError(
      "Registration Failed: Username must be at least three characters.",
      "/registration", 
      200
    )
  }

  if (!isNaN(username.charAt(0))) {
    throw new UserError(
      "Registration Failed: Username must begin with a character.",
      "/registration", 
      200
    )
  }

  if (email.search(/@/) < 1 || email == "") {
    throw new UserError(
      "Registration Failed: Email must be a valid email address.",
      "/registration", 
      200
    )
  }

  if (password.length < 8 || password == "") {
    throw new UserError(
      "Registration Failed: Password must be at least 8 characters.",
      "/registration", 
      200
    )
  }

  if (password.search(/[A-Z]/) < 0) {
    throw new UserError(
      "Registration Failed: Password must have at least 1 uppercase letter",
      "/registration", 
      200
    )
  }

  if (password.search(/[!@#$%^&*]/) < 0) {
    throw new UserError(
      "Registration Failed: Password must have at least 1 special character",
      "/registration", 
      200
    )
  }

  if (password.search(/[0-9]/) < 1) {
    throw new UserError(
      "Registration Failed: Password must have at least 1 number.",
      "/registration", 
      200
    )
  }

  if (password != confirmpass || confirmpass == "") {
    throw new UserError(
      "Registration Failed: Passwords do not match.",
      "/registration", 
      200
    )
  }

  db.execute("SELECT * FROM users WHERE username=?",[username]).then(
  ([results, fields]) => {
    if (results && results.length == 0) {
      return db.execute("SELECT * FROM users WHERE email=?", [email]); 
    } else {
      throw new UserError(
        "Registration Failed: Username already exists",
        "/registration",
        200
      );
    }
  })
  .then(([results, fields]) => {
    if (results && results.length == 0) {
      return bcrypt.hash(password,15);
    } else {
      throw new UserError(
        "Registration Failed: Email already exists",
        "/registration", 
        200
      );
    }
  })
  .then((hashedPassword) => {
    let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?, now());";
    return db.execute(baseSQL, [username, email, hashedPassword]);
  })
  .then (([results, fields]) => {
    if(results && results.affectedRows) {
      successPrint("User.js --> User was created!");
      req.flash('success', 'User account has been made!');
      res.redirect('/login');
    } else {
      throw new UserError(
        "Server Error, user could not be created",
        "/registration",
        500
      );
    }
  })
  .catch((err) => {
    errorPrint("User could not be made", err);
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  }) 
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  //server side validation on your own
  if (username == "") {
    throw new UserError(
      "Login Failed: Username field left blank.",
      "/login", 
      200
    )
  }

  if (password == "") {
    throw new UserError(
      "Login Failed: Password field left blank.",
      "/login", 
      200
    )
  }

  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
  let userId;
  db.execute(baseSQL, [username])
  .then(([results, fields]) => {
    if (results && results.length == 1) {
      let hashedPassword = results[0].password;
      userId = results[0].userId;
      return bcrypt.compare(password, hashedPassword);
    } else {
      throw new UserError("Invalid username and/or password", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if (passwordsMatched) {
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId = userId;
      res.locals.logged = true;
      req.flash('success', 'You have been successfully logged in!');
      res.redirect("/");
    } else {
      throw new UserError("invalid username and/or password", "/login", 200);
    }
  })
  .catch((err) => {
    errorPrint("user login failed");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      req.flash('error', 'Invalid username and/or password!');
      res.redirect('/login');
    } else {
      next(err);
    }
  });
});

router.post('/logout', (req, rest, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('Session could not be destroyed,');
      next(err);
    } else {
      successPrint('Session was destroyed.');
      res.clearCookie('csid');
      res.json({status: "OK", message: "User is logged out"});
    }
  })
});

module.exports = router;
