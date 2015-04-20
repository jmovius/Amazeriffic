/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/* Author: John Movius
 * Date: 03/25/15
*/

var main = function () {
	"use strict";

	var inputUrl = "",
		tmpStr="",
		$resultText = $("textarea.result").attr("disabled", "true"),
		$btn_play = $("<button>").text("Play").attr("class", "btn btn-default");

	$btn_play.on("click", function () {
		$("input.rdo-action").toArray().forEach(function (element) {
			if(element.checked) {
				inputUrl = "./play/" + element.value;
			}
		});

		console.log("Input URL: " + inputUrl);

			// Server API call
		$.ajax({
  			type: "GET",
  			url: inputUrl,
  			success: function(response) {
				tmpStr = "Server Played: " + response.serverPlayed +
						"\nYou " + response.outcome +
						"!\n\nServer Stats:" +
						"\nPlayer Wins: " + response.wins +
						"\nPlayer Losses: " + response.losses +
						"\nPlayer Ties: " + response.ties;
				$resultText.val(tmpStr);
  			},
  			error: function() {
    			$resultText.val("Unable to acquire statistics.");
  			}
		});
	});

	$("div .input-buttons").append($btn_play);
};
$(document).ready(main);