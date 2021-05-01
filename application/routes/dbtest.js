const express = require('express');
var router = express.Router();
const db = require('../conf/database');

router.get('/getAllUsers', (req, res, next) => {
    db.query('SELECT * from users;', (err, results, fields) => 
    {
        if (err) {
            //pass err object to the next middleware function
            next(err);
        }
        console.log(results);
        res.send(results);
    })
});
router.get('/getAllPosts', (req, res, next) => {
    db.query('SELECT * from posts;', (err, results, fields) => 
    {
        if (err) {
            //pass err object to the next middleware function
            next(err);
        }
        console.log(results);
        res.send(results);
    })
});
router.post('/createUser', (req, res, next) => {
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    //validate data. if bad, send back response
    //res.redirect('/registration);

    let baseSQL = 'INSERT INTO users (username, email, password, created) VALUES (?, ?, ?, now())';
    db.query(baseSQL, [username, email, password]).
    then(([results, fields]) => {
        if (results && results.affectedRows) {
            res.send('user was made');
        } else {
            res.send('user was not made for some reason');
        }
    })
})

//exposes pool to anyone who import file requires it
//gets reference to pool object
module.exports = router; 