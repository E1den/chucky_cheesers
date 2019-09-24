var express = require('express')
var app = express()

app.get('/srv/api_time_test.js', function(req, res) {
    res.send(new Date().toISOString())
})

app.get('/srv/err.js', function(req, res) {
    err = 200
    if (req.query.e) {
        err = req.query.e
    }

    res.contentType("html").write("<html><head><title>")

    switch (err) {
        case "305":
            res.write("305 (Use Proxy)");
            break;
        case "400":
            res.write("400 (Bad Request)");
            break;
        case "401":
            res.write("401 (Authorization)");
            break;
        case "403":
            res.write("403 (Forbidden)");
            break;
        case "404":
            res.write("404 (Not Found)");
            break;
        case "405":
            res.write("405 (Invalid Method)");
            break;
        case "406":
            res.write("406 (Bad Encoding)");
            break;
        case "407":
            res.write("407 (Must Use Proxy)");
            break;
        case "408":
            res.write("408 (Request Timed Out)");
            break;
        case "409":
            res.write("409 (Ambiguous Request)");
            break;
        case "410":
            res.write("410 (Gone)");
            break;
        case "413":
            res.write("413 (Request Length)");
            break;
        case "415":
            res.write("415 (Unknown Media)");
            break;
        case "500":
            res.write("500 (Internal)");
            break;
        case "502":
            res.write("502 (Gateway)");
            break;
        case "503":
            res.write("503 (Unavailable)");
            break;
        case "504":
            res.write("504 (Gateway Timeout)");
            break;
        default:
            res.write("Y tho?")
    }
    res.write("</title><body style='margin: 7% auto 0;margin-top: 7%; margin-right: auto; margin-bottom: 0;margin-left: auto;max-width: 390px;min-height: 180px;padding: 30px 0 15px;'><center>")
    switch (err) {
        case "305":
            res.write("<i><b>\"Speak in French when you can't think of the English for a thing\"</b></i><p/>Please use a proxy to connect. 305 (Use Proxy)");
            break;
        case "400":
            res.write("<i><b>\"Mr. Spock, the women on your planet are logical.\"</b></i><p/>Your client has sent an invalid request. 400 (Bad Request)");
            break;
        case "401":
            res.write("<i><b>\"You are authorized to use all measures available to destroy the Enterprise.\"</b></i><p/> You, however, do not have authorization to do what you just requested. 401 (Authorization)");
            break;
        case "403":
            res.write("<i><b>\"The first speech censored, the first thought forbidden, the first freedom denied, chains us all irrevocably.\"</b></i><p/>However, You still cannot perform the requested action. 403 (Forbidden)");
            break;
        case "404":
            res.write("<i><b>\"There's nothing out there; absolutely nothing\"</b></i><p/>The requested page does not exist. 404 (Not Found)");
            break;
        case "405":
            res.write("<i><b>\"If there's nothing wrong with me... maybe there's something wrong with the universe!\"</b></i><p/> You are using an invalid method. 405 (Invalid Method)");
            break;
        case "406":
            res.write("<i><b>\"Jibberish\"</b></i><p/> Your request was sent in an invalid encoding. 406 (Bad Encoding)");
            break;
        case "407":
            res.write("<i><b>\"Travel time to the nearest starbase?\"</b></i><p/> In order to use this page you must use a proxy. 407 (Must Use Proxy)");
            break;
        case "408":
            res.write("<i><b>\"Seize the time, Meribor. Live now; make now always the most precious time. Now will never come again\"</b></i><p/> Your request did not finish in a valid time. 408 (Request Timed Out)");
            break;
        case "409":
            res.write("<i><b>\"For years he stuggled with his discontent, but the only satisfaction he ever got came when he was in battle.\"</b></i><p/> Your requested file is in conflict. 409 (Ambiguous Request)");
            break;
        case "410":
            res.write("<i><b>\"Jean-Luc! It's so good to see you again. How about a big hug?\"</b></i><p/> Your file is GONE.410 (Gone)");
            break;
        case "413":
            res.write("<i><b>\"Too bad. You'd be amazed at what I can do in a pair of size 18's.\"</b></i><p/> The request sent is too large. 413 (Request Length)");
            break;
        case "415":
            res.write("<i><b>\"Darmok and Jalad... at Tanagra.\"</b></i><p/> You have requested with an unknown media format. 415 (Unknow Media)");
            break;
        case "500":
            res.write("<i><b>\"Fate protects fools, little children and ships named Enterprise\"</b></i><p/> The server screwed up. 500 (Internal)");
            break;
        case "502":
            res.write("<i><b>\"Lal, I am unable to correct the system failure\"</b></i><p/> Our gateway is bad. 502 (Gateway)");
            break;
        case "503":
            res.write("<i><b>\"You must talk to him; tell him that he is a good cat, and a pretty cat, and...\"</b></i><p/> We are unavailable at this time. 503 (Unavailable)");
            break;
        case "504":
            res.write("<i><b>\"All good things must come to an end...\"</b></i><p/> Our gateway timed out. 'Hurray'(Sarcastically) 504 (Gateway Timeout)");
            break;
        default:
            res.write("Absolutely nothing is wrong. Why are you even here??")
    }
    res.end()
})

app.use(function(req, res){
    res.contentType("html").status(404).send("<html><head><title>404 (Not Found)</title><body style='margin: 7% auto 0;margin-top: 7%; margin-right: auto; margin-bottom: 0;margin-left: auto;max-width: 390px;min-height: 180px;padding: 30px 0 15px;'><center><i><b>\"There's nothing out there; absolutely nothing\"</b></i><p/>The requested page does not exist. 404 (Not Found)")
})

app.listen("9000", "node")