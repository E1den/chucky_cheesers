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


    if(search == "" || search==undefined)
        mysql.accessAllComic(search, function (err, rows) {
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