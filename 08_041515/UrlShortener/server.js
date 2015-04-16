/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/* Author: John Movius
 * Date: 04/15/15
*/

"use strict";

var express = require("express"),
	http = require("http"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
	app = express();

////// Connect to mongoose DB and define schema //////
mongoose.connect("mongodb://localhost/UrlShortener");
var mdb = mongoose.connection;
mdb.on("error", function (err) {
    console.log("MongoDB connection error.", err);
});
mdb.once("open", function () {
    console.log("MongoDB connected.");
});

var Schema = mongoose.Schema;
var urlsSchema = new Schema({
        key: String,
        url: String
    }
);
var urlHitsSchema = new Schema({
        shortUrl: String,
        hits: Number
    }, {
        capped: 5242880
    }
);
var keyScheme = new Schema({
        id: String,
        key: Number
    }
);
var urls = mdb.model("urls", urlsSchema),
    urlHits = mdb.model("urlHits", urlHitsSchema),
    key = mdb.model("key", keyScheme);

////// Set up directories and Middleware //////
app.use(express.static(__dirname + "/views"));
app.use("/javascript",  express.static(__dirname + "/javascript"));
app.use("/style",  express.static(__dirname + "/style"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////// Server Functions //////
// Error checking function checks if a save completed successfully.
var saveCallback = function (err, val) {
    if(err) {
        console.log(err);
    } else {
        console.log("Saved: " + val);
    }
};

/*
urls.remove({}, function (err) { 
   console.log("URLs Removed.");
});
key.remove({}, function (err) { 
   console.log("Key Removed.");
});
urls.find({}, function (err, val) { 
   console.log("URLs: " + val);
});
key.find({}, function (err, val) { 
   console.log("Key: " + val);
});
//*/

key.findOne({ id:"next" }, function (err, val) {
    if(val === null) {
        var INIT_KEY = new key({
            id: "next",
            key: 10 * Math.pow(36, 3) // Initilalize key position.
        });
        INIT_KEY.save(saveCallback);
    } else {
        console.log("Current Key Value: " + val.key);
    }
});

// Simple random number generator.
var randomGen = function (low, high) {
    return(Math.floor(Math.random() * (high - low + 1) + low));
};

// Generates the next key and stores it in the database: getKey(Callback);
var getKey = function (fn) {
    var incr = randomGen(1, 10);

    key.findOne({ id:"next" }, function (err, val) {
        val.key += incr;
        val.save(saveCallback);
        //console.log("value: " + val.key);
        //console.log("base36: " + val.key.toString(36));
        fn(val.key.toString(36));
    });
};

////// Set up routes //////
app.get("/", function (req, res) {
//    rdb.flushall(); // Uncomment to erase all data in all redis databases.
    if(req.query.hits === "true") {
        // console.log("SERVER - /hits");
        urlHits.find().sort({ hits:-1 }).limit(10).exec(function (err, hits) {
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

    urls.findOne({ key:inputUrl }, function (err, val) {
        if(val === null) {
            getKey(function (key) {
                shortUrl = shortUrl + key;

                var tmpUrl = new urls({
                    key: inputUrl,
                    url: shortUrl
                });
                tmpUrl.save(saveCallback);

                tmpUrl = new urls({
                    key: shortUrl,
                    url: inputUrl
                });
                tmpUrl.save(saveCallback);

                var tmpHit = new urlHits({
                    shortUrl: shortUrl,
                    hits: 0
                });
                tmpHit.save(saveCallback);

//                rdb.zadd("hits", 0, shortUrl); // A
        
                res.json({ msg:"Shortened URL: ", url:shortUrl });
            });
        } else {
            res.json({ msg:"Related URL: ", url:val.url });
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

    urls.findOne({ key:fullUrl }, function (err, val) {
        //console.log("SERVER - val: " + val);
        if(val !== null) {
            urlHits.findOne({ shortUrl:fullUrl }, function (err, val) {
                val.hits += 1;
                //console.log("Hits: " + val.hits);
                val.save(saveCallback);
            });
            res.redirect(val.url);
        } else {
            res.redirect("/");
        }
    });
});

////// Start server //////
http.createServer(app).listen(3000);
