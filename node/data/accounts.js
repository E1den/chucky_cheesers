//Handles logging in
const mysql = require('mysql');
const config = require('./config.js');
const mailer = require('nodemailer');
const fs = require('fs');

//Connection data, only used when connect called
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: config.meta.credentials.user,
    password: config.meta.credentials.password,
    database: config.meta.credentials.database
});

const sender = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.meta.mail.user,
        pass: config.meta.mail.password
    }
});

var mail = {
    from: config.meta.mail.user,
    to: config.meta.mail.user,
    subject: "Password Reset Instructions",
    attachments: [{
        filename: 'logo.png',
        path: 'static_pages/logo.png',
        cid: 'logo'
    },
    {
        filename: 'reset.png',
        path: 'static_pages/reset.png',
        cid: 'reset'
    }],
    html: "__ERROR__"
};

fs.readFile('static_pages/password.html', 'utf8', function (err, data) {
    mail.html = data;
});

//Handles user login
exports.login = function (req, res) {
    try {
        email = req.body[0].value;
        password = req.body[1].value;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }


    //quick validate, html, and function check
    if (email == "" | email.includes("<") | email.includes(")") | email.includes("'") | email.includes("\"") | !email.includes("@") | !email.includes(".")) {
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
exports.logout = function (req, res) {
    delete req.session.user;
    res.send("done");
}

//Handles user signing up for a new account
exports.signup = function (req, res) {
    try {
        user = req.body[0].value;
        email = req.body[1].value;
        password = req.body[2].value;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    //quick validate, html, and function check
    if (email == "" | email.includes("<") | email.includes(")") | email.includes("'") | email.includes("\"") | !email.includes("@") | !email.includes(".") | user == "" | user.includes("<") | user.includes(")") | user.includes("'") | user.includes("\"")) {
        res.send("failure");
        return;
    }



    con.connect(function (err) {
        //validate
    });

    req.session.user = user;
    res.send("success");
}

exports.forgot = function (req, res) {
    try {
        email = req.body[0].value;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    //quick validate, html, and function check
    if (email == "" | email.includes("<") | email.includes(")") | email.includes("'") | email.includes("\"") | !email.includes("@") | !email.includes(".")) {
        res.send("failure");
        return;
    }

    //TODO

    //replace __USERNAME__
    //replace __SERVER__
    //replace __RESETKEY__

    key = "RANDOM_HASHEDKEY_FOR_A_TEMP_AMMOUNT_OF_TIME"

    user = "username"
    path = "/srv/acct/forgot?k="+key

    pack = mail;
    pack.to = email;
    pack.html = pack.html.replace(/__USERNAME__/g, user)
    pack.html = pack.html.replace(/__SERVER__/g, config.meta.server.public)
    pack.html = pack.html.replace(/__RESETKEY__/g, path);

    sender.sendMail(pack);

    //always send success to obscure account existance
    res.send("success")
}

exports.updateForgot = function(req, res) {
    key = req.query.k
    //validate key exists,
    //send password update page in this function
    //that page sends data to the update function in a POST request
    //that then logs the user in and forwards back to the homepage
}

//Handles user updating data, eg password
exports.update = function (req, res) {
    //TODO
}

//Gets the current data to display about login state for a given user
exports.getAccountSession = function (req, res) {
    //into: "account-session-on"

    if (req.session.user) {
        res.send("<a href='/accounts' class='nav-link' id='AccName'>" + req.session.user + "</a><button onclick='signOut()' class='sign-out-btn'><c>Sign Out</c></button>");
    }
    else {
        res.send("<a href='/login' class='nav-link'>Login/Signup</a>");
    }
}