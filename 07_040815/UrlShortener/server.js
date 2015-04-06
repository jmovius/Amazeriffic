/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/* Author: John Movius
 * Date: 04/08/15
*/

"use strict";

var express = require("express"),
	http = require("http"),
    bodyParser = require("body-parser"),
    rdb = require("redis").createClient(),
	app = express();

////// Set up directories and Middleware //////
app.use(express.static(__dirname + "/views"));
app.use("/javascript",  express.static(__dirname + "/javascript"));
app.use("/style",  express.static(__dirname + "/style"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////// Server Functions //////
var INIT_KEY = 10 * Math.pow(36, 3); // Initilalize key position.

// Simple random number generator.
var randomGen = function (low, high) {
    return(Math.floor(Math.random() * (high - low + 1) + low));
};

var getKey = function (rdb, fn) {
    rdb.setnx("next", INIT_KEY); // Stores the database key position in the database.

    var incr = randomGen(1, 10);

    rdb.incrby("next", incr, function (err, val) {
        //console.log("value: " + val);
        //console.log("base36: " + val.toString(36));
        fn(val.toString(36));
    });
};

////// Set up routes //////
app.get("/", function (req, res) {
//    rdb.flushall(); // Uncomment to erase all data in all redis databases.
    if(req.query.hits === "true") {
        // console.log("SERVER - /hits");
        rdb.zrevrange("hits", 0, 9, "withscores", function (err, hits) {
            res.json(hits);
        });
    } else {
        //console.log("GET INDEX");
        res.sendFile(__dirname + "/views/default.html");
    }
});

app.post("/", function (req, res) {
    var inputUrl = req.body.inputUrl,
        shortUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    if(inputUrl === "") {
        return res.json({ msg:"Please enter a URL and click submit.", url:"" });
    }

    //console.log("SERVER - inputUrl: " + shortUrl);

    rdb.get(inputUrl, function (err, val) {
        if(val === null) {
            getKey(rdb, function (key) {
                shortUrl = shortUrl + key;
        
                rdb.set(shortUrl, inputUrl);
                rdb.set(inputUrl, shortUrl);
                rdb.zadd("hits", 0, shortUrl);
        
                res.json({ msg:"Shortened URL: ", url:shortUrl });
            });
        } else {
            res.json({ msg:"Long URL: ", url:val });
        }
    });

    //rdb.keys("*", function(err, val) {
    //    console.log("Keys: " + val);
    //});

    //console.log("Parse: \n" + req.body.shortUrl);
});

app.get("/:url", function (req, res) {
    var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    //console.log("fullUrl: " + fullUrl);

    rdb.get(fullUrl, function (err, val) {
        //console.log("SERVER - val: " + val);
        if(val !== null) {
            rdb.zincrby("hits", 1, fullUrl);
            res.redirect(val);
        } else {
            res.redirect("/");
        }
    });
});

////// Start server //////
http.createServer(app).listen(3000);
