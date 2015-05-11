(function (Spine, $, exports){
    var $inputComment = $("#inputComment"),
        $submitComment = $("#submitComment"),
        $commentsList = $("#commentsList");
    
    /* Model */
    var Comment = Spine.Model.sub(); // Init new Spine model object by extending Spine.Model.
    Comment.configure("Comment", "comment", "isHidden"); // Object name and private members
    Comment.extend(Spine.Model.Local); // Set Comment to store to local data.
    
    // Member functions.
    Comment.include({
        report: function () {
            if(!this.isHidden) {
                return (this.comment);
            }
        }
    });

    Comment.bind("create", function (msg) {
        $inputComment.val("");
        $commentsList.append($("<li>").html(msg.comment));
    });
    
    // Pull local data and load it to Comment.
    Comment.fetch();
//    Comment.destroyAll(); // Uncomment to destroy all comments.
    
    var initComments = function (msg) {
        var cmt = Comment.all(),
            len = cmt.length,
            output = [],
            i;

        $commentsList.empty();
        for(i = 0; i < len; i++) {
            output.push($("<li>").html(cmt[i].comment));
        }
        $commentsList.append(output);
    };

    var submitComment = function (msg) {
        var cmt = new Comment({comment:msg, isHidden:false});
        cmt.save();
    };

    /* ----- Controllers ----- */

    // Button Controller
    var ButtonController = Spine.Controller.sub({
        tag: "section",
        events: {
            "click": "click"
        },
        click: function () {
            submitComment($inputComment.val());
        }
    });
    ButtonController.extend(Spine.Events);
    var buttonController = new ButtonController({
        el: $submitComment
    });

    // Input Controller
    var InputController = Spine.Controller.sub({
        tag: "section",
        events: {
            "keyup": "keyup"
        },
        keyup: function (e) {
            if (e.keyCode === 13) {
                submitComment($inputComment.val());
            }
        }
    });
    InputController.extend(Spine.Events);
    var inputController = new InputController({
        el: $inputComment
    });

    initComments();

})(Spine, Spine.$, window);
