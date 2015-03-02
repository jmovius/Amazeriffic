var main = function () {
	"use strict;"

	// For each tab that exists.
	$(".tabs a span").toArray().forEach(function (element) {
		// Create a click handler.
		$(element).on("click", function () {
			$(".tabs a span").removeClass("active"); // Remove active class.
			$(element).addClass("active"); // Add active class to active tab.
			$("main .content").empty(); // Remove content from main.
			return false; // Return false to avoid following link.
		});
	});
};
$(document).ready(main);