//Handles logging in
const mysql = require('./mysql');
const config = require('./config.js');
const mailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');

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

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
    if (!emailRegexp.test(email)) {
        res.send("failure");
        return;
    }

    hashed = crypto.createHash('sha256').update(password).digest('base64');

    try {
        result = mysql.accessUserByEmail(email, function (rows) {
            if (rows == undefined || rows.length == 0) {
                //ERROR NON EXISTANT
                res.send("failure");
            }
            else if (rows[0].password == hashed) {
                //SUCCESS
                req.session.user = rows[0].display_name;
                res.send("success");
            }
            else {
                //ERROR BAD PASSWORD
                res.send("failure");
            }
        });
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

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
    if ((!emailRegexp.test(email)) | user == "" | user.includes("<") | user.includes(")") | user.includes("'") | user.includes("\"")) {
        res.send("failure");
        return;
    }

    hashed = crypto.createHash('sha256').update(password).digest('base64');

    try {
        result = mysql.accessUserByEmail(email, function (rows) {
            if (rows == undefined || rows.length == 0) {
                mysql.createUser(user, email, hashed);
                req.session.user = user;
                res.send("success");
            }
            else {
                res.send("failure");
            }
        });
    } catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
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
    if ((!emailRegexp.test(email))) {
        res.send("failure");
        return;
    }

    try {
        result = mysql.accessUserByEmail(email, function (rows) {
            if (rows == undefined || rows.length == 0) {
                res.send("failure");
            }
            else {
                //replace __USERNAME__
                //replace __SERVER__
                //replace __RESETKEY__

                key = "RANDOM_HASHEDKEY_FOR_A_TEMP_AMMOUNT_OF_TIME"

                user = "username"
                path = "/srv/acct/forgot?k=" + key

                pack = mail;
                pack.to = email;
                pack.html = pack.html.replace(/__USERNAME__/g, user)
                pack.html = pack.html.replace(/__SERVER__/g, config.meta.server.public)
                pack.html = pack.html.replace(/__RESETKEY__/g, path);

                sender.sendMail(pack);

                //always send success to obscure account existance
                res.send("success")
            }
        });
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
}

exports.updateForgot = function (req, res) {
    key = req.query.k
    //validate key exists,
    //send password update page in this function
    //that page sends data to the update function in a POST request
    //that then logs the user in and forwards back to the homepage
}

//Handles user updating data, eg password
exports.update = function (req, res) {
    //TODO
    try
    {
        oldpass = req.body[0].value;
        newpass = req.body[1].value;
        newpassconf = req.body[2].value;
        if(newpass != newpassconf)
        {
          res.send("failure");
        }
    }
    catch(e)
    {
      req.query.e = 400;
      err.error(req, res);
      return;
    }

    hashed = crypto.createHash('sha256').update(oldpassword).digest('base64');
    hashednew = crypto.createHash('sha256').update(newpassword).digest('base64');

    try {
        result = mysql.accessUserByEmail(email, function (rows) {
            if (rows == undefined || rows.length == 0) {
                //ERROR NON EXISTANT
                res.send("failure");
            }
            else if (rows[0].password == hashed) {
                //SUCCESS
                req.session.user = rows[0].display_name;
                res.send("success");
            }
            else {
                //ERROR BAD PASSWORD
                res.send("failure");
            }
        });
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
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
