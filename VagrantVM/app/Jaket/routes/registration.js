#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var users = require("../models/users");
var Group = require("../models/group");

var staticRegistration = {
			"john": {
				username: "john", 
				password: crypto.createHash("sha256").update("test123").digest("hex"),
				email: "jmovius@nomail.com",
				admin: true
			},
			"tyler": {
				username:"tyler",
				password: crypto.createHash("sha256").update("test123").digest("hex"),
				email:"tyler@nomail.com",
				admin: false
			}
};

// Creates user in Database. NOTE: Should be post.
router.get("/new/:username", function (req, res) {
	var newuser = new _users(staticRegistration[req.params.username]);

	newuser.save(function (err) {
		if (err) {
			console.log(err);
			res.send("SERVER ERROR: Registration failed.");
		} else {
			res.send("Registration successful!");
		}
	});
});

// Get user information.
router.get("/:username", function (req,res) {
	_users.findOne({username: req.params.username}, function (err, user) {
		if (err) { 
			res.send("user not found");
		}
		res.send(user);
	});
});

// Deletes user from database via user's ID.
router.get("/delete/:id", function (req,res){
	_users.remove({_id: req.params.id}, function (err) {
		if (err) {
			res.send("user not found");
		}
		res.send("user deleted successfully");
	});
});

module.exports = router;