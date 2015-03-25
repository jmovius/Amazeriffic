#!/usr/bin/env node

/*
 *  Author: John Movius
 *  Date: 03/18/15
 *
 *  NOTE: The rules for "Rock/Paper/Scissors/Lizard/Spock" were pulled from the following website: http://www.samkass.com/theories/RPSSL.html
 */

 /* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var http = require("http"),
    response = {
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

/*
var sendResponse = function (res) {
    console.log("-----\nOutcome: " + response.outcome + "\nWins: " + response.wins + "\nLosses: " + response.losses + "\nTies: " + response.ties + "\n-----");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(response));
    console.log("Response sent to user.\n\n");
    response.outcome = "";
    response.serverPlayed = "";
};

var serverIdle = function (req, res) {
    if (req.method !== "POST") {
        console.log("GET Received");
        return;
    }

    if (req.url === "/play/rock") {
        console.log("Player: rock");
        serverAction("rock");
        sendResponse(res);
    } else if(req.url === "/play/paper") {
        console.log("Player: paper");
        serverAction("paper");
        sendResponse(res);
    } else if(req.url === "/play/scissors") {
        console.log("Player: scissors");
        serverAction("scissors");
        sendResponse(res);
    } else if(req.url === "/play/lizard") {
        console.log("Player: lizard");
        serverAction("lizard");
        sendResponse(res);
    } else if(req.url === "/play/spock") {
        console.log("Player: spock");
        serverAction("spock");
        sendResponse(res);
    } else {
        console.log("Invalid selection received.\n\n");
    }
};

var server = http.createServer(serverIdle);
server.listen(3000);
var address = server.address();
console.log("server is listening at http://localhost:" + address.port + "/");
*/


//////////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var app = express();
var router = express.Router();

app.use('/play/:action', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// handler for /user/:id which renders a special page
router.get('/play/:action', function (req, res) {
    res.json(serverAction(action));
});

// mount the router on the app
app.use('/', router);
