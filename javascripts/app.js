var main = function () {
	"use strict";

	var toDos = [
		"Finish writting this book",
		"take Gracie to the park",
		"Answer emails",
		"Prep for Monday's class",
		"Make up some new ToDos",
		"Get Groceries"
	];

	// For each tab that exists.
	$(".tabs a span").toArray().forEach(function (element) {
		var $element = $(element);
		// Create a click handler.
		$element.on("click", function () {
			var $content, i, $input, $button;

			$(".tabs a span").removeClass("active"); // Remove active class.
			$element.addClass("active"); // Add active class to active tab.
			$("main .content").empty(); // Remove content from main.

			if ($element.parent().is(":nth-child(1)")) {
				$content = $("<ul>");
				for(i = toDos.length - 1; i >= 0; i--) {
					$content.append($("<li>").text(toDos[i]));
				}
			} else if ($element.parent().is(":nth-child(2)")) {
				$content = $("<ul>");
				toDos.forEach(function (todo) {
					$content.append($("<li>").text(todo));
				});
			} else if ($element.parent().is(":nth-child(3)")) {
                $input = $("<input>");
                $button = $("<button>").text("+");

                $button.on("click", function () {
                    if ($input.val() !== "") {
                        toDos.push($input.val());
                        $input.val("");
                    }
                });

                $content = $("<div>").append($input, $button);
			}

			$("main .content").append($content);

			return false; // Return false to avoid following link.
		});
	});

	// Trigger a click on the first tab.
	$(".tabs a:first-child span").trigger("click");
};
$(document).ready(main);