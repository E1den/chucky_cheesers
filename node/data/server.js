const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//Load in custom pages
const error_handler = require('./error.js');
const accounts = require('./accounts.js');
const config = require('./config.js');
const comic = require('./comic.js');

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
app.post('/srv/acct/login', accounts.login);
app.post('/srv/acct/logout', accounts.logout);
app.post('/srv/acct/signup', accounts.signup);
app.post('/srv/acct/forgot', accounts.forgot);
app.get('/srv/acct/forgot', accounts.updateForgot);
app.get('/srv/acct/update', accounts.update);
app.get('/srv/acct/getSess', accounts.getAccountSession);

//Handle comic data
app.post('/srv/comic/search', comic.search);
app.post('/srv/comic/create', comic.create);
app.post('/srv/comic/delete', comic.delete);
app.post('/srv/comic/pages', comic.getPages)

//Handle bad status code error pages
app.get('/srv/err', error_handler.error);
app.use(error_handler.quick_404);

app.listen("9000", "0.0.0.0");