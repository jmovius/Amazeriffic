#!/usr/bin/env node

/*
 *  Author: John Movius
 *  Date: 03/18/15
 *
 *  NOTE: The rules for "Rock/Paper/Scissors/Lizard/Spock" were pulled from the following website: http://www.samkass.com/theories/RPSSL.html
 */

"use strict";

var http = require("http"),
    // querystring = require("querystring"),
    // child_process = require("child_process"),
    response = {
        outcome: "",
        serverPlay: "",
        wins: 0,
        losses: 0,
        ties: 0,
    },
    gameRules = [
        {
            serverPlay: "rock",
            playerLose: ["scissors", "lizard"]
        },
        {
            serverPlay: "paper",
            playerLose: ["rock", "spock"]
        },
        {
            serverPlay: "scissors",
            playerLose: ["paper", "lizard"]
        },
        {
            serverPlay: "lizard",
            playerLose: ["paper", "spock"]
        },
        {
            serverPlay: "spock",
            playerLose: ["rock", "scissors"]
        }
    ];

var serverAction = function (action) {
    var sPlay = gameRules[Math.floor(Math.random() * gameRules.length)];

    response.serverPlay = sPlay.serverPlay;

    console.log("Server: " + sPlay.serverPlay);

    if (sPlay.serverPlay === action) {
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

var sendResponse = function (res) {
    console.log("-----\nOutcome: " + response.outcome + "\nWins: " + response.wins + "\nLosses: " + response.losses + "\nTies: " + response.ties + "\n-----");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(response));
    console.log("Response sent to user.\n\n");
    response.outcome = "";
    response.serverPlay = "";
};

var serverIdle = function (req, res) {
    //console.log("req.url " + req.url);

    if (req.url === "/play/rock") {
        console.log("Player: rock");
        serverAction("rock");
        sendResponse(res);
    } else if(req.url === "/play/paper") {
        console.log("Player: paper");
        serverAction("paper");
        sendResponse(res);
    } else if(req.url === "/play/scissors") {
        console.log("Player: ccissors");
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
    } else if(req.url === "/favicon.ico") {
        console.log("/favicon.ico request ignored.\n\n");
    } else {
        console.log("Invalid selection received.\n\n");
    }
};

var server = http.createServer(serverIdle);
server.listen();
var address = server.address();
console.log("server is listening at http://localhost:" + address.port + "/");
