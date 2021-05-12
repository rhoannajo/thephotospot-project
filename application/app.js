var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var mySqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');
var handlebars = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentRouter = require('./routes/comments');

var errorPrint = require("./helpers/debug/debugprinters.js").errorPrint;
var requestPrint = require("./helpers/debug/debugprinters.js").requestPrint;
var successPrint = require("./helpers/debug/debugprinters.js").successPrint;
 
var app = express();

app.engine(
    "hbs", 
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        patialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: { 
            emptyObject: (obj, options) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0)
            }
        }
    })
);

var mySqlSessionStore = new mySqlSession(
    {
        /*using default options */
    },
    require('./conf/database')
);
app.use(sessions({
    key: "csid",
    secret: "this is a secret from csc317",
    store: mySqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=> {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    console.log(req.session);
    //if session has property username or initialized session
    if(req.session.username) {
        res.locals.logged = true;
    }
    next();
})

app.use('/', indexRouter);
//app.use('/dbtest', dbRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentRouter);

//from example to test error
/*app.use((err, req, res, next) => {
    res.status(500);
    res.send('something went wrong with DB');
})*/

app.use((err, req, res, next) => {
    console.log(err);
    res.render('error', {err_message: err});
});

module.exports = app;
