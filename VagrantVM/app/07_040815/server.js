/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var express = require("express"),
	http = require("http"),
    bodyParser = require('body-parser'),
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

//getKey(rdb, function (key){
//    alert(key); // this is where you get the return value
//});

var getKey = function (rdb, fn) {
    rdb.setnx("next", INIT_KEY); // Stores the database key position in the database.

    var incr = randomGen(1, 10),
        value;

    rdb.incrby("next", incr, function (err, val) {
        console.log("value: " + val);
        console.log("base36: " + val.toString(36));
        fn(val.toString(36));
    });
};

////// Set up routes //////
app.get("/", function (req, res) {
    console.log("GET INDEX");

    res.sendFile(__dirname + "/views/_index.html");
});

app.post("/", function (req, res) {
    var inputUrl = req.body.inputUrl,
        shortUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    console.log("SERVER - inputUrl: " + shortUrl);


    rdb.get(inputUrl, function (err, val) {
        if(val !== null) {
            getKey(rdb, function (key) {
                shortUrl = shortUrl + key;
        
                rdb.set(shortUrl, inputUrl);
                rdb.set(inputUrl, shortUrl);
        
                res.json({ message:"URL Shortened: ", url:shortUrl });
            });
        } else {
            res.json({ shortUrl:val, url:inputUrl });
        }
    });

//    rdb.flushall();

    rdb.keys("*", function(err, val) {
        console.log("Keys: " + val);
    });

    //console.log("Parse: \n" + req.body.shortUrl);
});

app.get("/:url", function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log("fullUrl: " + fullUrl);

    rdb.get(fullUrl, function (err, val) {
        console.log("SERVER - val: " + val);
        if(val !== null) {
            rdb.zadd("hits", 0, fullUrl);
            res.redirect(val);
        } else {
            res.redirect("/");
        }
    });
});

app.get("/hits", function (req, res) {
    rdb.zrevrange("hits", 0, -1, 'withscores', function(err, members) {
        console.log("Members (next): " + members);
    });
});

////// Start server //////
http.createServer(app).listen(3000);
