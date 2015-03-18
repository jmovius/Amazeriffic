#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var express = require("express"),
    http = require("http"),
    app = express(),
    credentials = require("./credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

var params = {screen_name: "CrackerJack473"};


app.use(express.static(__dirname + "/client"));
app.use(express.json());       // to support JSON-encoded request body
app.use(express.urlencoded()); // to support URL-encoded request body


// Initialize and populate imitation database.
var database = require("./database.js");

database.createGroup("CrackerJack473","CPSC 473 - Web Design Group");
database.createGroup("videogames","Videogames Group"); // Placeholder
database.createGroup("animals","Animals Group"); // Placeholder

database.createUser("jmovius",
    "955C4C87F9F8BA4CFC2F8888DB882B31954160FBFF7EB24DD81EBC0F71A21E6772368EA3ACB479BDA154995B3AB4AE14786CC6841C9C913572B2FA875A814DF1",
    "jmovius@nomail.com",
    ["CrackerJack473","videogames","animals"]);

database.createUser("tempuser",
    "7F5DB9C31A86321002D68796A99F5D7527F42F61B5CE116167C571411FA14B3EFD4904D5D0EF2E3428EB0BAE3D5F5C642BC9EBD650927791805A59B8C4E8FC5D",
    "tempuser@nomail.com",
    ["CrackerJack473"]);

// Routes
app.get("/feed", function(req, res) {
	twitterClient.get("statuses/user_timeline", params, function(error, tweets, response){
		if (!error) {
			tweets.forEach(function (t) {
				feed.push(t.text);	
			});
			res.json(feed);			
		}
	});
});

app.post("/publish", function(req, res) {
	console.log("I will publish the tweet to twitter");
	console.log(req.body.tweet);
	// TODO: validate the input received
	twitterClient.post("statuses/update", {status: req.body.tweet},  function(error, t, response){
		if (error) {
			console.log("error:");
			res.json({"message":"An error occurred!"});
			throw error;
		}
		// console.log(t);  // Tweet body. 
		// console.log(response);  // Raw response object. 
	});

	res.json({"message":"Tweet is published successfully!"});

});

// Start Server
http.createServer(app).listen(3000);

console.log("Server running on port 3000");