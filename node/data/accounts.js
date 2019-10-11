//Handles logging in
var mysql = require('mysql');

exports.login = function(req, res) {
    //
    var con = mysql.createConnection({
        host: "127.0.0.1",
        user: config.credentials.user,
        password: config.credentials.password
      });
    con.connect(function (err) {
        res.send(req.user);
    });
}

exports.update = function(req, res) {

}