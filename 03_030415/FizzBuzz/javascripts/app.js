var main = function () {
	"use strict;"

	var clicked = false;

    var fizzbuzz_1 = function() {
    	var i;

    	for(i = 1; i <= 100; i++) {
    		$(".fb1_results").append(fizzbuzz_logic(i, "Fizz", "Buzz"));
    	}
    }

    var fizzbuzz_2 = function(start, end) {
    	var i;

    	for(i = start; i <= end; i++) {
    		$(".fb2_results").append(fizzbuzz_logic(i, "Fizz", "Buzz"));
    	}
    }

    var fizzbuzz_3 = function(arr) {
    	var i;

    	for(i = 0; i <= arr.length; i++) {
    		$(".fb3_results").append(fizzbuzz_logic(arr[i], "Fizz", "Buzz"));
    	}
    }

    var fizzbuzz_4 = function(obj) {
    	var i;

    	for(i = 1; i <= 100; i++) {
    		$(".fb4_results").append(fizzbuzz_logic(i, obj.divisibleByThree, obj.divisibleByFive));
    	}
    }

    var fizzbuzz_5 = function(arr, obj) {
    	var i;

    	for(i = 0; i <= arr.length; i++) {
    		$(".fb5_results").append(fizzbuzz_logic(arr[i], obj.divisibleByThree, obj.divisibleByFive));
    	}
    }

    var fizzbuzz_logic = function (i, str1, str2) {
    		var $new_value;

    		if(i%3===0 && i%5===0) {
    			$new_value = $("<p>").text(str1+str2);
    		} else if(i%3===0) {
    			$new_value = $("<p>").text(str1);
    		} else if(i%5===0) {
    			$new_value = $("<p>").text(str2);
    		} else {
    			$new_value = $("<p>").text(i);
    		}

    		return($new_value);
    }

	$(".fb_button").on("click", function (event) {
		var arr = [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115];
		var obj = {divisibleByThree: "foo",divisibleByFive:"bar"};
		if(!clicked) {
			fizzbuzz_1();
			fizzbuzz_2(200, 300);
			fizzbuzz_3(arr);
			fizzbuzz_4(obj);
			fizzbuzz_5(arr, obj);
		}
		clicked = true;
	});
};
$(document).ready(main);