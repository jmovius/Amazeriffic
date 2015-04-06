/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/* Author: John Movius
 * Date: 04/08/15
*/

var main = function () {
	"use strict";

	var inputUrl = "",
		$inputText = $("input.input-text"),
		$btn_submit = $("<button>").text("Submit").attr("class", "btn btn-default"),
		$btn_hits = $("<button>").text("Refresh Hits").attr("class", "btn btn-default");

	var submitUrl = function () {
		inputUrl = $inputText.val();

		if(inputUrl !== "") {
			console.log("Input URL: " + inputUrl);
	
			$.post("/",{ inputUrl:inputUrl }).done(function(res) {
				document.getElementById("message").innerHTML = res.msg + "<a href=\"" + res.url + "\">" + res.url + "</a>";
				$btn_hits.trigger("click");
			});

			$inputText.val("");

		} else {
			document.getElementById("message").innerHTML = "Please enter a URL and click submit.";
		}
	};

	$btn_submit.on("click", function () {
		submitUrl();
	});

	$(".input-text").keyup(function (e) {
		//document.getElementById("message").innerHTML = "";
    	if (e.keyCode === 13) {
    		submitUrl();
    	}
	});

	$btn_hits.on("click", function () {
		var len,
			i,
			tmp;

		$("div.hits-content").empty();

		$.get("/", { hits:"true" }, function(response) {
			len = response.length;
			for(i = 0; i < len; i++) {
				tmp = (i+2)/2;
				$("div.hits-content").append(tmp.toString() + ": <a href=\"" + response[i] + "\">" + response[i] + "</a> -- " + response[i+1] + "<br />");
				i+=1;
			}
		});
	});

	$("div .input-buttons").append($btn_submit);
	$("div .hits-header").append($btn_hits);
	$btn_hits.trigger("click");
};
$(document).ready(main);