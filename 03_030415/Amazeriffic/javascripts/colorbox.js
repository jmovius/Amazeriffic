var createSlideshow = function () {
	"use strict";

	// Declare variables.
	var pics = [];

	// Add titles to the desired images.
	pics.push("<a class='demo_gallery' href='images/demo/demo_01.png' title='View the ToDo list with newest first.'>View Demo</a>");
	pics.push("<a class='demo_gallery' href='images/demo/demo_02.png' title='View the ToDo list with oldest first.'></a>");
	pics.push("<a class='demo_gallery' href='images/demo/demo_03.png' title='Add user created ToDo item.'></a>");
	pics.push("<a class='demo_gallery' href='images/demo/demo_04.png' title='View the ToDo list with user created item (newest first).'></a>");
	// Only instructed to include 4 photos, omitting the fifth.
	//pics.push("<a class='demo_gallery' href='images/demo/demo_05.png' title='View the ToDo list with user created item (oldest first).'></a>");

	// Load images to display as content.
	$(".slideshow_gallery").append(pics);

	// Define the colorbox gallery behavior.
	$(".demo_gallery").colorbox({
									rel:'demo_gallery',
									slideshow:true,
									retinaImage:true,
									slideshowStop:'Stop Slideshow',
									slideshowStart:'Start Slideshow',
									maxWidth:"855px",
									maxHeight:"100%"
								});

	// Uncomment to have the slideshow start automatically.
	//$(".slideshow_gallery a:first-child").trigger("click");
};
$(document).ready(createSlideshow);