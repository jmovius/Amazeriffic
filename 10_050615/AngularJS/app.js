var app = angular.module("commentApp", []),
	$inputComment = $("#inputComment"),
	$submitComment = $("#submitComment");

app.controller("commentController", function ($scope) {
	$scope.comment = "";
    $scope.commentList = ["This is the first comment!", "Here's the second one!", "And this is one more.", "Here is another one!"];
    $scope.submitComment = function () {
    	if($scope.comment !== "") {
        	$scope.commentList.push($scope.comment);
        	$scope.comment = "";
        	$inputComment.focus();
    	}
    };
});

$inputComment.on("keyup", function (e) {
	if (e.keyCode === 13) {
		$submitComment.click();
	}
});