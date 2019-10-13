const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//Load in custom pages
const error_handler = require('./error.js');
const accounts = require('./accounts.js');
const config = require('./config.js')

var app = express();

//Setup sessions
app.use(cookieParser());
app.use(session({
    secret: config.meta.session.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());

//Handle account controls
app.post('/srv/acct/login.js', accounts.login);
app.post('/srv/acct/logout.js', accounts.logout);
app.post('/srv/acct/signup.js', accounts.signup);
app.get('/srv/acct/update.js', accounts.update);
app.get('/srv/acct/getSess.js', accounts.getAccountSession)

//Handle bad status code error pages
app.get('/srv/err.js', error_handler.error);
app.use(error_handler.quick_404);

app.listen("9000", "0.0.0.0");