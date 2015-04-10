// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var main = function () {
	"use strict";

	var $btn_login = $("#btn_login");

	$btn_login.on("click", function () {
		var hash = CryptoJS.SHA256($("#password").val()).toString();

		$.post("/login",{ username:$("#username").val(), password:hash }).done(function (response) {
			if(response.msg === "success") {
				$(location).attr("href","/");
			} else {
				$("#alert").text(response.msg);
			}
		});
	});

	$("#username").on("keyup", function (e) {
		if (e.keyCode === 13) {
			$("#password").focus();
		}
	});

	$("#password").on("keyup", function (e) {
		if (e.keyCode === 13) {
			$btn_login.click();
		}
	});
};
$(document).ready(main);
