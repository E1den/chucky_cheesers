//Handles comics
const mysql = require('./mysql.js');
const config = require('./config.js');
const err = require('./error.js')

exports.create = function (req, res) {
    try {
        title = req.body.title.value;
        cover = req.body.cover.value;
        tags = req.body.tags.value;
        description = req.body.description.value;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    mysql.createComic(req.session.user, title, tags, false, description);
    mysql.accessComic(title, function (err, res) {
        res.write(res[0].comic_id);
        res.end();
    });
}

exports.getPages = function (req, res) {
    var data = { pages: [] };
    res.contentType("json");
    mysql.accessComicPageList(req.body.id, function (err, rows) {
        rows.foreach(function (row) {
            data.pages.push({
                layout: row.layout,
                //NEED TO VERIFY STRUCTURE OF THE DB
                frames: JSON.parse(row.frames)
            });
        });
        res.write(JSON.encode(data));
        res.end();
    });
}

exports.search = function (req, res) {

    try {
        search = req.body.search;
        type = req.body.type;
        rowNum = req.body.row;
        time = req.body.start;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    //con.connect(function (err) {
    res.contentType("html");

    //get the data to send from the sql server

    //FOR TESTING PURPOSES
    // if(rowNum>20)
    // {
    //     res.write("done");
    //     res.end();
    //     return;
    // }

    // //END TESTING

    // //send the next 5 rows
    // for (var row = 0; row < 5; row++) {
    //     res.write("<div class='bookcontainer'>");
    //     for (var col = 0; col < 5; col++) {
    //         var details = "Details and stuff";
    //         res.write("<div class='book'><div class='overlay'><div class='bookDetails'>" + details + "</div></div></div>");
    //     }

    //     res.write("</div>");
    // }

    // res.end();

    mysql.accessComic(search, function (rows) {
        if (rowNum < rows.length) {
            res.write("done")
            return;
        }

        res.write("<div class='bookcontainer'>");
        for (var row = rowNum; row < rowNum + 5; row++) {
            res.write("<div class='book'><div class='overlay'><div class='bookDetails'><h2>" + rows[row].comic_name + "</h2>" + rows[row].descrip + "</div></div></div>");
        }
        res.write("</div>");
    })

    res.end();
}