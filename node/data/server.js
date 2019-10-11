const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.safeLoad(fs.readFileSync('./sql_cred.yml', 'utf8'));

var error_handler = require('./error.js');
var testing = require('./api_test.js');
var accounts = require('./accounts.js');

var app = express();

//Load in SQL credential
//sql creds at
//  user        -> config.credentials.user
//  password    -> config.credentials.password

//Test the timing (not the best measurement because it will very by machine)
app.get('/srv/api_time_test.js', testing.timeTest);

//Handle account controls
app.get('/srv/acct/login.js', accounts.login);
app.get('/srv/acct/update.js', accounts.update);

//Handle bad status code error pages
app.get('/srv/err.js', error_handler.error);
app.use(error_handler.quick_404);
app.use(express.json());

app.listen("9000", "0.0.0.0");