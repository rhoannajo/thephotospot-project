var errorPrint = require("../helpers/debug/debugprinters").errorPrint;
var successPrint = require("../helpers/debug/debugprinters").successPrint;

const routeProtectors = {};

//express
routeProtectors.userIsLoggedIn = function(req, res, next) {
    if (req.session.username) {
        successPrint('User is logged in');
        next();
    } else {
        errorPrint('user is not logged in!');
        req.flash('error', 'You must be logged in to create a post!');
        res.redirect('/login');
    }
}

module.exports = routeProtectors;