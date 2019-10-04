var express = require('express')
var error_handler = require('./error.js')
var testing = require('./api_test.js')
var app = express()

//Test the timing (not the best measurement because it will very by machine)
app.get('/srv/api_time_test.js',testing.time_test)

//Handle bad status code error pages
app.get('/srv/err.js', error_handler.error)
app.use(error_handler.quick_404)

app.listen("9000", "0.0.0.0")