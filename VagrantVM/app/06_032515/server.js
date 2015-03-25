/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var express = require("express"),
	http = require("http"),
	app = express();

// Set up directories.
app.use(express.static(__dirname + "/views"));
app.use("/javascript",  express.static(__dirname + "/javascript"));
app.use("/style",  express.static(__dirname + "/style"));


var response = {
        outcome: "",
        wins: 0,
        losses: 0,
        ties: 0,
        serverPlayed: ""
    },
    gameRules = [
        {
            serverPlays: "rock",
            playerLose: ["scissors", "lizard"]
        },
        {
            serverPlays: "paper",
            playerLose: ["rock", "spock"]
        },
        {
            serverPlays: "scissors",
            playerLose: ["paper", "lizard"]
        },
        {
            serverPlays: "lizard",
            playerLose: ["paper", "spock"]
        },
        {
            serverPlays: "spock",
            playerLose: ["rock", "scissors"]
        }
    ];

var serverAction = function (action) {
    var sPlay = gameRules[Math.floor(Math.random() * gameRules.length)];

    response.serverPlayed = sPlay.serverPlays;

    console.log("Server: " + sPlay.serverPlays);

    if (sPlay.serverPlays === action) {
        response.outcome = "tie";
        ++response.ties;
    } else if(sPlay.playerLose.indexOf(action) > -1) {
        response.outcome = "lose";
        ++response.losses;
    } else {
        response.outcome = "win";
        ++response.wins;
    }
};

// Set up routes.
app.get("/play/:action", function (req, res) {
	serverAction(req.params.action);
	res.json(response);
});

// Start server.
http.createServer(app).listen(3000);
