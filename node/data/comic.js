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

exports.delete = function(req, res) {
    try{
        mysql.deleteComic(req.body.id.value,req.body.user.value);
    }
    catch(e)
    {
        req.query.e = 400;
        err.error(req, res);
        return;
    }
}

exports.getPages = function (req, res) {
    var data = { page: [] };
    res.contentType("json");

    mysql.accessComicPageList(req.body.id, function (err, rows) {
        rows.foreach(function (row) {
            data.page.push(JSON.parse(row.layout));
        });
        res.write(JSON.stringify(data));
        res.end();
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

exports.update = function(req, res) {
    try {
        //res.body
        mysql.accessComicPageList( function (err, rows) {
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

    if(search == "" || search==undefined)
        mysql.accessAllComic( function (err, rows) {
            res.write("</div>");
            rows.forEach(function(row,index){
                if(index%5==0){
                    if(index!=0)
                        res.write("</div>");
                    res.write("<div class='bookcontainer'>");
                }
                res.write("<div class='book'><div class='overlay'><div class='bookDetails' cid='"+row.comic_id+"'><h2>" + row.comic_name + "</h2>" + row.descrip + "</div></div></div>");
            });
            res.write("</div>");

            res.end();
        });
    else
        mysql.accessComic(search, function (err, rows) {
            res.write("</div>");
            rows.forEach(function(row,index){
                if(index%5==0){
                    if(index!=0)
                        res.write("</div>");
                    res.write("<div class='bookcontainer'>");
                }
                res.write("<div class='book'><div class='overlay'><div class='bookDetails' cid='"+row.comic_id+"'><h2>" + row.comic_name + "</h2>" + row.descrip + "</div></div></div>");
            });
            res.write("</div>");

            res.end();
        });


}