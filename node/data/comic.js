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
        mysql.deleteComic(req.body.id.value, req.body.user.value);
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
}

//verify owner of comic
function verifyOwner(callback) {
    mysql.accessUser(req.session.user, function (orows) {
        mysql.accessComicByID(id, function (err, rows) {
            if (rows[0].user_id != orows[0].user_id) {
                req.query.e = 400;
                err.error(req, res);
                return;
            }
            else
                callback();
        });
    });
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

    mysql.accessUser(req.session.user, function (orows) {
        if (orows == undefined || orows == null || orows.length == 0) {
            res.write("failure")
            res.end();
            return;
        }
        mysql.accessComicByID(id, function (err, rows) {
            console.log("loading: ");
            console.log(rows[0]);
            if (rows[0].user_id != orows[0].user_id) {
                req.query.e = 400;
                err.error(req, res);
                return;
            }
            else {
                res.contentType("json");
                res.write(JSON.stringify(rows[0]));
                res.end();
            }
        });
    });
}

exports.getPages = function (req, res) {
    var data = { page: [] };
    res.contentType("json");

    console.log(req.body.id);

    mysql.accessComicPageList(req.body.id, function (err, rows) {
        console.log(rows);
        rows.forEach(function (row,index) {
            mysql.accessPage(row.page_id,function(err,row){
                data.page.push(row.layout);
                if(index==rows.length)
                {
                    console.log(data);
                    res.write(JSON.stringify(data));
                    res.end();
                }
            })
        });
    });
    /* example of data to send -->
    data = {
        "page": [

            {
                "layout": 0,
                "frames": [
                    {
                        imageURL: "1.png"
                    },

                    {
                        imageURL: "1.png"
                    },
                    {
                        imageURL: "1.png"
                    },
                    {
                        imageURL: "1.png"
                    }
                ]
            }, {
                "layout": 0,
                "frames": [
                    {
                        imageURL: "2.png"
                    },
                    {
                        imageURL: "2.png"
                    },
                    {
                        imageURL: "2.png"
                    },
                    {
                        imageURL: "2.png"
                    }]
            }, {
                "layout": 0,
                "frames": [
                    {
                        imageURL: "3.png"
                    },
                    {
                        imageURL: "3.png"
                    },
                    {
                        imageURL: "3.png"
                    },
                    {
                        imageURL: "3.png"
                    }]
            }
            , {
                "layout": 0,
                "frames": [
                    {
                        imageURL: "4.png"
                    },
                    {
                        imageURL: "4.png"
                    },
                    {
                        imageURL: "4.png"
                    },
                    {
                        imageURL: "4.png"
                    }]
            }
            , {
                "layout": 0,
                "frames": [
                    {
                        imageURL: "5.png"
                    },
                    {
                        imageURL: "6.png"
                    },
                    {
                        imageURL: "7.png"
                    },
                    {
                        imageURL: "8.png"
                    }]
            }

        ]
    };
    res.write(JSON.stringify(data));
    res.end();*/
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

exports.pushImg = function (res, req) {
    //{ 'img': frameData, 'comic': window.COMIC_ID, 'frame': current_index, 'page': currentPageNumber })

    try {
        img = req.body.img;
        comic = req.body.comic;
        frame = req.body.frame;
        page = req.body.page;
    }
    catch (e) {
        req.query.e = 400;
        err.error(req, res);
        return;
    }


    //save frame
    var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");
    var image_id = mysql.appendImage("NULL");
    fs.writeFile("../../web/data/imgs/" + image_id + ".jpg", base64Data, 'base64', function (err) {
        console.log(err);
    });

    //add frame to page
    mysql.accessComicPageListDESC(comic, function (err, rows) {
        var page_id = rows[0].page_id;
        mysql.updatePage(page_id, function (rows) {
            var data = "{frames:[]}";
            try {
                data = JSON.parse(rows[0].layout);
            } catch (e) { }
            data.frames[frame]={
                imageURL:"../../web/data/imgs/" + image_id + ".jpg"
            }
            return JSON.stringify(data);
        });
    });

}