//Handles comics
const mysql = require('mysql');
const config = require('./config.js');

//Connection data, only used when connect called
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: config.meta.credentials.user,
    password: config.meta.credentials.password,
    database: config.meta.credentials.database
});

exports.gallery = function (req, res) {

    const rowNum = req.body.row;
    const time = req.body.start;

    //con.connect(function (err) {
    res.contentType("html");

    //FOR TESTING PURPOSES
    if(rowNum>20)
    {
        res.write("done");
        res.end();
        return;
    }

    //END TESTING

    //send the next 5 rows
    for (var row = 0; row < 5; row++) {
        res.write("<div class='bookcontainer'>");
        for (var col = 0; col < 5; col++) {
            var details = "Details and stuff";
            res.write("<div class='book'><div class='overlay'><div class='bookDetails'>" + details + "</div></div></div>");
        }

        res.write("</div>");
    }

    res.end();
    //});


}