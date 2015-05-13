(function (Spine, $, exports){
    var $inputComment = $("#inputComment"),
        $submitComment = $("#submitComment"),
        $commentsList = $("#commentsList"),
        $commentItem = $("div.commentSpan");
    
    /* Model */
    var Comment = Spine.Model.sub(); // Init new Spine model object by extending Spine.Model.
    Comment.configure("Comment", "comment", "isHidden"); // Object name and private members
    Comment.extend(Spine.Model.Local); // Set Comment to store to local data.

    // Member functions.
    Comment.include({
        buildComment: function (i) {
            var val = "",
                hidden = "";

            //console.log(this.id);

            if(this.isHidden) {
                hidden = " hidden";
            }

            val = "<div id=\"c-" + i + "\" class=\"visible" + hidden + "\">" + this.comment + "</div>";
            return($("<li>").html(val).attr("class", "commentListItem"));
        },
        toggleHidden: function () {
            $("#" + this.id).toggleClass("hidden", !this.isHidden);
            this.isHidden = (!this.isHidden);
            this.save();
        }
    });

    Comment.bind("create", function (cmt) {
        $inputComment.val("");
        $commentsList.append(cmt.buildComment(Comment.count()+1));
    });
    
    // Pull local data and load it to Comment.
    Comment.fetch();
//    Comment.destroyAll(); // Uncomment to destroy all comments.

    var initComments = function () {
        var cmt = Comment.all(),
            len = cmt.length,
            output = [],
            i, hide;

        cmt[0].buildComment();

        $commentsList.empty();
        for(i = 0; i < len; i++) {
            output.push(cmt[i].buildComment(i));
        }
        $commentsList.append(output);
    };

    var submitComment = function (msg) {
        if(msg !== "") {
            var cmt = new Comment({comment:msg, isHidden:false});
            cmt.save();
        }
    };

    /* ----- Controller ----- */
    var CommentController = Spine.Controller.sub({
        tag: "section"
    });
    CommentController.extend(Spine.Events);

    var buttonController = new CommentController({
        el: $submitComment,
        events: {
            "click": "click"
        },
        click: function () {
            submitComment($inputComment.val());
        }
    });

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

    initComments();

    var hiddenController = new CommentController({
        el: $("div"),
        events: {
            "click": "click"
        },
        click: function (e) {
            var cmt = Comment.find(e.target.id);
            console.log(cmt.comment);
            cmt.toggleHidden();
        }
    });

})(Spine, Spine.$, window);
