(function (Spine, $, exports){
    "use strict";

	var _hiddenClass = "hidden"; // Set the name of the class used to hide comments.
    var Comment = exports.Comment; // Retrieve model from the global namespace.

    // Initialize JQuery Objects
    var $inputComment = $("#inputComment"),
        $submitComment = $("#submitComment"),
        $commentsList = $("#commentsList"),
        $deleteComments = $("#deleteComments");

    // Function will create a comment, then append it to the view.
    var submitComment = function (msg) {
    	var val, cmt;

      	if(msg !== "") {
            cmt = Comment.getNewComment(msg); // Get new comment object.
      		val = cmt.getJqueryWithTag("li", _hiddenClass); // Get the JQuery object and store it to val.

            $inputComment.val("");
            $commentsList.append(val);
        }
    };

    /* ----- Controller ----- */
    var CommentController = Spine.Controller.sub({
        tag: "section"
    });
    CommentController.extend(Spine.Events);

    // Submit a comment using the + button.
    var buttonController = new CommentController({
        el: $submitComment,
        events: {
            "click": "click"
        },
        click: function () {
            submitComment($inputComment.val());
        }
    });

    // Submit a comment by hitting enter from the input box.
    var inputController = new CommentController({
        el: $inputComment,
        events: {
            "keyup": "keyup"
        },
        keyup: function (e) {
            if (e.keyCode === 13) {
                submitComment($inputComment.val());
            }
        }
    });

    // Click a comment adds the CSS class "hidden".
    var hiddenController = new CommentController({
        el: $commentsList,
        events: {
            "click": "click"
        },
        click: function (e) {
        	// Acquire the comment based on the ID of the item clicked.
            var cmt = Comment.find(e.target.id);

            // Update the DOM to toggle the hiddenClass attribute.
            $("#" + cmt.id).toggleClass(_hiddenClass, cmt.toggleHiddenClass());
        }
    });

    // Click the "Delete All Comments" button destroys all objects stored in the Comments data model.
    var buttonDeleteController = new CommentController({
        el: $deleteComments,
        events: {
            "click": "click"
        },
        click: function () {
            Comment.destroyAll(); // Destroy all comments.
            $commentsList.empty(); // Empty comments from the view.
        }
    });

    // Initialize all comments.
    $commentsList.empty();
    $commentsList.append(Comment.initCommentsWithTag("li", _hiddenClass));

})(Spine, Spine.$, window);
