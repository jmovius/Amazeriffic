/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/* Author: John Movius
 * Date: 03/25/15
*/

var main = function () {
	"use strict";

	var inputUrl = "",
		$inputText = $("input.input-text"),
		$btn_submit = $("<button>").text("Submit").attr("class", "btn btn-default");

	var submitUrl = function () {
		inputUrl = $inputText.val();

		if(inputUrl !== "") {
			console.log("Input URL: " + inputUrl);
	
			$.post("/",{ inputUrl:inputUrl }).done(function(res) {
				document.getElementById("message").innerHTML = "<a href=\"" + res.shortUrl + "\">" + res.shortUrl + "</a>" + " :: " + res.longUrl;
			});

			$inputText.val("");

		} else {
			document.getElementById("message").innerHTML = "Please enter a URL.";
		}
	};

	$btn_submit.on("click", function () {
		submitUrl();
	});

	$(".input-text").keyup(function (e) {
		//document.getElementById("message").innerHTML = "";
    	if (e.keyCode == 13) {
    		submitUrl();
    	}
	});

//	$.getJSON(inputUrl, function (response) {
//		tmpStr = "Server Played: " + response.serverPlayed +
//				"\nYou " + response.outcome +
//				"!\n\nServer Stats:" +
//				"\nPlayer Wins: " + response.wins +
//				"\nPlayer Losses: " + response.losses +
//				"\nPlayer Ties: " + response.ties;
//		$resultText.val(tmpStr);
//	});

	$("div .input-buttons").append($btn_submit);
};
$(document).ready(main);