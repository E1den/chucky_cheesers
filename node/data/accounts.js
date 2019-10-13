//Handles logging in
const mysql = require('mysql');
const config = require('./config.js');

//Connection data, only used when connect called
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: config.meta.credentials.user,
    password: config.meta.credentials.password,
    database: config.meta.credentials.database
    });

//Handles user login
exports.login = function(req, res) {
    const email = req.body[0].value;
    const password = req.body[1].value;

    //quick validate, html, and function check
    if(email==""|email.includes("<")|email.includes(")")|email.includes("'")|email.includes("\"")|!email.includes("@")|!email.includes("."))
    {
        res.send("failure");
        return;
    }



    con.connect(function (err) {
        //validate
    });

    req.session.user = email;
    res.send("success");
}

//Handles user logout
exports.logout = function(req,res) {
    delete req.session.user;
    res.send("done");
}

//Handles user signing up for a new account
exports.signup = function(req, res) {
    const user = req.body[0].value;
    const email = req.body[1].value;
    const password = req.body[2].value;

    //quick validate, html, and function check
    if(email==""|email.includes("<")|email.includes(")")|email.includes("'")|email.includes("\"")|!email.includes("@")|!email.includes(".")|user==""|user.includes("<")|user.includes(")")|user.includes("'")|user.includes("\""))
    {
        res.send("failure");
        return;
    }



    con.connect(function (err) {
        //validate
    });

    req.session.user = user;
    res.send("success");
}

//Handles user updating data, eg password
exports.update = function(req, res) {
    //TODO
}

//Gets the current data to display about login state for a given user
exports.getAccountSession = function(req, res) {
    //into: "account-session-on"

    if(req.session.user)
    {
        res.send("<a href='/accounts' class='nav-link' id='AccName'>"+req.session.user+"</a><button onclick='signOut()' class='sign-out-btn'><c>Sign Out</c></button>");
    }
    else
    {
        res.send("<a href='/login' class='nav-link'>Login/Signup</a>");
    }
}