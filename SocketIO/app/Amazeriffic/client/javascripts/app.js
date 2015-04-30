var main = function (toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function (toDo) {
            // we'll just return the description
            // of this toDoObject
            return toDo.description;
    });

    // Connect Socket
    var socket = io.connect("http://localhost:3000");

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length-1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {"description":description, "tags":tags};

                    socket.emit("newToDoEvent", newToDo);
                    $input.val("");
                    $tagInput.val("");
                });

                $content = $("<div>").append($inputLabel)
                                     .append($input)
                                     .append($tagLabel)
                                     .append($tagInput)
                                     .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    socket.on("newToDoEvent", function (data) {
        toDoObjects = data;
        toDos = toDoObjects.map(function (toDo) {
            return toDo.description;
        });

        var newToDo = toDoObjects[toDoObjects.length-1],
            $active = $("span.active");

        if ($active.parent().is(":nth-child(1)")) { // Newest
            $("main .content ul").prepend($("<li>").text(newToDo.description));
        } else if ($active.parent().is(":nth-child(2)")) { // Oldest
            $("main .content ul").append($("<li>").text(newToDo.description));
        } else if ($active.parent().is(":nth-child(3)")) { // Tags

            // List of all tags that have already been initilalized.
            var initialTags = $(".content h3").toArray().map(function (tag) {
                return $(tag).text();
            });

            // For each tag this ToDo contains.
            newToDo.tags.forEach(function (tag) {

                var tagIndex = initialTags.indexOf(tag);
    
                alert("newToDo.tags: " + newToDo.tags + "; tagIndex: " + tagIndex + ";");
    
                if (tagIndex === -1) { // Tag does not currently exist.
                    //alert("tag.name: " + tag.name + "; tag.toDo: " + tag.toDos + ";");
                    var $tagName = $("<h3>").text(newToDo.tags),
                        $content = $("<ul>"),
                        $li = $("<li>").text(newToDo.description);
                    
                    $content.append($li);
    
                    $("main .content").append($tagName);
                    $("main .content").append($content);
                } else { // Tag exists, must add new ToDo to the existing tag unordered list.
                    var $li = $("<li>").text(newToDo.description);
                    $(".content h3:nth-of-type(" + (tagIndex + 1) + ")").next().append($li);
                }
            });
        }
    });

    socket.on("SUCCESS", function (data) {
        toDoObjects = data;
        toDos = toDoObjects.map(function (toDo) {
            return toDo.description;
        });
    })

    socket.on("ERROR", function (err) {
        console.log(err);
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
