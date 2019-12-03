//Handles comics
const mysql = require('./mysql.js');
const config = require('./config.js');
const err = require('./error.js')
const busboy = require('connect-busboy');
const fs = require('fs-extra');

exports.create = function (req, res) {

    var title = "";
    var tags = "";
    var description = "";

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log(fieldname + ":=" + val);
        if (fieldname == "title")
            title = val;
        if (fieldname == "tags")
            tags = val;
        if (fieldname == "description")
            description = val;
    });

    req.busboy.on('file', function (fieldname, file, filename) {

        console.log("Uploading " + filename);

        mysql.accessUser(req.session.user, function (rows) {
            mysql.createComic(rows[0].user_id, title, tags, "false", description, function (err, id) {
                res.write("" + id);
                fstream = fs.createWriteStream("../../web/data/covers/" + id + ".jpg");
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.end();
                });
            });
        });

    });

    // try {
    //     cover = req.body.cover;
    //     title = req.body.title;
    //     tags = req.body.tags;
    //     description = req.body.description;
    // }
    // catch (e) {
    //     req.query.e = 400;
    //     err.error(req, res);
    //     return;
    // }
}

exports.delete = function (req, res) {
    try {
        mysql.deleteComic(req.body.id.value, null);
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
}

exports.getComicData = function (req, res) {

    try {
        id = req.body.id;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    //verify owner
    try {
        // mysql.accessUser(req.session.user, function (orows) {
        //     if (orows == undefined || orows == null || orows.length == 0) {
        //         res.write("failure")
        //         res.end();
        //         return;
        //     }
            mysql.accessComicByID(id, function (err, rows) {
                console.log("loading: ");
                console.log(rows[0]);

                    res.contentType("json");
                    res.write(JSON.stringify(rows[0]));
                    res.end();
            });
        // });
    } catch (e) { }
}

exports.getPages = function (req, res) {
    var data = { page: [] };
    res.contentType("json");
    mysql.accessComicPageList(req.body.id, function (err, rows) {
        if (rows == undefined || rows.length == 0) {
            res.write(JSON.stringify(data));
            res.end();
        }
        rows.forEach(function (row, index) {
            mysql.accessPage(row.page_id, function (err, row) {
                data.page.push(JSON.parse(row[0].layout));
                if (index == rows.length - 1) {
                    res.write(JSON.stringify(data));
                    res.end();
                }
            })
        });
    });
}

exports.update = function (req, res) {
    try {
        //res.body
        mysql.accessComicPageList(function (err, rows) {
            var n = rows.length;
        });

    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
}

exports.search = function (req, res) {

    try {
        search = req.body.search;
        type = req.body.type;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }

    //con.connect(function (err) {
    res.contentType("html");
    if (type == 0) {
        try {

            if (search == "" || search == undefined)
                mysql.accessAllComic(function (err, rows) {
                    if (rows == undefined || rows == null) {
                        res.end();
                        return;
                    }
                    res.write("</div>");
                    rows.forEach(function (row, index) {
                        if (index % 5 == 0) {
                            if (index != 0)
                                res.write("</div>");
                            res.write("<div class='bookcontainer'>");
                        }
                        res.write("<div class='book'style=\"background:url('/covers/" + row.comic_id + ".jpg');background-size:cover;\"><div class='overlay'><div class='bookDetails' cid='" + row.comic_id + "'><h2>" + row.comic_name + "</h2>" + row.descrip + "</div></div></div>");
                    });
                    res.write("</div>");

                    res.end();
                });
            else
                mysql.accessComic(search, function (err, rows) {
                    if (rows == undefined || rows == null) {
                        res.end();
                        return;
                    }
                    res.write("</div>");
                    rows.forEach(function (row, index) {
                        if (index % 5 == 0) {
                            if (index != 0)
                                res.write("</div>");
                            res.write("<div class='bookcontainer'>");
                        }
                        res.write("<div class='book' style=\"background:url('/covers/" + row.comic_id + ".jpg');background-size:cover;\"><div class='overlay'><div class='bookDetails' cid='" + row.comic_id + "'><h2>" + row.comic_name + "</h2>" + row.descrip + "</div></div></div>");
                    });
                    res.write("</div>");

                    res.end();
                });
        }
        catch (e) { res.end(); }
    }
    else {

        mysql.accessUser(req.session.user, function (thing) {

            if(thing==undefined||thing.length==0)
            {
                res.end();
                return;
            }

            mysql.accessAllComicForUser(thing[0].user_id, function (err, rows) {
                console.log("dsfgs");
                if (rows == undefined || rows == null || rows.length==0) {
                    res.end();
                    return;
                }

                console.log(rows);

                res.write("</div>");
                rows.forEach(function (row, index) {
                    if (index % 5 == 0) {
                        if (index != 0)
                            res.write("</div>");
                        res.write("<div class='bookcontainer'>");
                    }
                    res.write("<div class='book'style=\"background:url('/covers/" + row.comic_id + ".jpg');background-size:cover;\"><div class='overlay'><div class='bookDetails' cid='" + row.comic_id + "'><h2>" + row.comic_name + "</h2>" + row.descrip + "</div></div></div>");
                });
                res.write("</div>");

                res.end();
            });
        });
    }


}

exports.pushPage = function (req, res) {

    // ({ 'comic': window.COMIC_ID, 'page': currentPageNumber, 'layout': layout })

    console.log(req.body);

    try {
        comic = req.body.comic;
        page = req.body.page;
        layout = req.body.layout;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }



    // mysql.accessComicPageList(comic, function (err, rows) {
    //     if(rows==undefined||rows.length==0)
    //     {
    //         //make new page and add to this list
    //     }
    //     else
    //     {
    //comic exists
    //latest page on top
    mysql.accessUser(req.session.user, function (rows) {
        console.log(rows[0].user_id);
        mysql.createPage(comic, rows[0].user_id, JSON.stringify(layout));
        res.end();
    });
    //}
    //});
}

exports.pushImg = function (req, res) {
    //{ 'img': frameData, 'comic': window.COMIC_ID, 'frame': current_index, 'page': currentPageNumber })
    try {
        img = req.body.img;
        comic = Number(req.body.comic);
        frame = req.body.frame;
        page = req.body.page;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }


    //save frame
    var base64Data = img.replace(/^data:image\/png;base64,/, "");
    mysql.appendImage("NULL", function (err, result) {
        var image_id = result;
        console.log("id:" + image_id);
        fs.writeFile("../../web/data/imgs/" + image_id + ".png", base64Data, 'base64', function (err) {
            console.log("FILE ERROR");
            console.log(err);
        });

        //add frame to page
        mysql.accessComicPageListDESC(comic + "", function (err, rows) {
            var page_id = rows[0].page_id;
            console.log(page_id);
            mysql.updatePage(page_id, function (rows) {
                var data = { frames: [] };
                try {
                    data = JSON.parse(rows[0].layout);
                } catch (e) { }
                console.log(data)
                data.frames[frame - 1] = {
                    imageURL: image_id + ".png"
                };
                res.write(page_id + "");
                res.end();
                return JSON.stringify(data);
            });
        });
    });

}