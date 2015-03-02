var main = function () {
	"use strict;"

	var makeTabActive = function (tabNumber) {
		var tabSelector = ".tabs a:nth-child(" + tabNumber + ") span";
		$(".tabs span").removeClass("active"); // Make all tabs inactive.
		$(tabSelector).addClass("active"); // Make the first tab active.
		$("main .content").empty(); // Empty the main content so we can recreate it.
	}

	$(".tabs a:nth-child(1)").on("click", function () {
		makeTabActive(1);
		return false; // Return false, so we don't follow the link.
	});

	$(".tabs a:nth-child(2)").on("click", function () {
		makeTabActive(2);
		return false;
	});

	$(".tabs a:nth-child(3)".on("click", function () {
		makeTabActive(3);
		return false;
	});
};
$(document).ready(main);