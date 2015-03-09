/* Author: John Movius
 * Date: 03/09/15
 * Test String:
 * Testing to see how this thing works depending on how many characters are used in this paragraph. There may be a reduction in the number of characters used, but I'm not sure how many character would be reduced, so I'm going to fill up the whole thing.
*/

var main = function () {
	"use strict";

	var _maxLength = 250,
		revertInput = "",
		inputUrl = "",
		originalLen = 0,
		$charLen = $('div .char-len'),
		$inputText = $('textarea.input-text').attr('maxlength',_maxLength).attr('placeholder',"Input Tweet"),
		$btn_revert = $("<button>").text("Revert").attr('class', 'btn btn-default').attr('disabled',true),
		$btn_shorten = $("<button>").text("Shorten").attr('class', 'btn btn-default');

	var setCharLen = function(len) {
		if(len==0) {
			$btn_shorten.attr('disabled', true);
		}
		$charLen.text(len + '/' + _maxLength);
	}
	setCharLen(0);

	$inputText.on('keydown', function(event) {
		originalLen = $inputText.val().length;
	});

	$inputText.on('keyup', function(event) {
		if(originalLen != $inputText.val().length) {
			$btn_revert.attr('disabled', true);
			$btn_shorten.attr('disabled', false);	
		}
		setCharLen($inputText.val().length);
	});

	$btn_revert.on("click", function () {
		$inputText.val(revertInput);
		setCharLen(revertInput.length);
		$btn_revert.attr('disabled', true);
		$btn_shorten.attr('disabled', false);
	});

	$btn_shorten.on("click", function () {
		$btn_shorten.attr('disabled', true);
		if($inputText.val().length > 0) {
			revertInput = $inputText.val();

			inputUrl = "http://www.feathr.it/api?text=" + $inputText.val().replace(/ /g, '%20');

			// Feather.it API Call
			$.getJSON(inputUrl, function (response) {
				$inputText.val(response[0].Shorten_Text);
				setCharLen(response[0].Shorten_Text.length);
			});
		}
		$btn_revert.attr('disabled', false);
	});

	$('div .input-buttons').append($btn_revert, $btn_shorten);
};
$(document).ready(main);