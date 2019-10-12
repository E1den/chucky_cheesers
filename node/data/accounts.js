//Handles logging in
const mysql = require('mysql');
const config = require('./config.js');

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: config.meta.credentials.user,
    password: config.meta.credentials.password,
    database: config.meta.credentials.database
    });

exports.login = function(req, res) {
    const email = req.body[0].value;
    const password = req.body[1].value;

    con.connect(function (err) {
        //validate
    });

    req.session.user = email;
    res.send("success");
}

exports.logout = function(req,res) {
    delete req.session.user;
    res.send("done");
}

exports.update = function(req, res) {

}

exports.getAccountSession = function(req, res) {
    //into: "account-session-on"

    if(req.session.user)
    {
        res.send("<a href='accounts.html' class='nav-link' id='AccName'>"+req.session.user+"</a><button onclick='signOut()' class='sign-out-btn'><c>Sign Out</c></button>");
    }
    else
    {
        res.send("<a href='login.html' class='nav-link'>Login/Signup</a>");
    }
}