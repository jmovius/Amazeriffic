var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    app = express(),
    server = http.createServer(app),
	socketIO = require("socket.io"),
	io = socketIO(server);

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

server.listen(3000);

app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
		res.json(toDos);
    });
});

// SocketIO
io.sockets.on("connection", function (socket) { // event handler on connection.
	console.log("User Connected");

	socket.on("disconnect", function () {
		console.log("User Disconnected");
	});

	socket.on("newToDoEvent", function (data) { // event handler on myevent.
		console.log(data);
    	var newToDo = new ToDo({"description":data.description, "tags":data.tags});
    	newToDo.save(function (err, result) {
			if (err !== null) {
			    // the element did not get saved!
			    socket.emit("ERROR", err);
			} else {
			    // our client expects *all* of the todo items to be returned, so we'll do
			    // an additional request to maintain compatibility
			    ToDo.find({}, function (err, result) {
					if (err !== null) {
					    // the element did not get saved!
					    socket.emit("ERROR", err);
					}
					socket.emit("SUCCESS", result);
					socket.broadcast.emit("newToDoEvent", result);
					//io.sockets.emit("newToDoEvent", result); // Sends to all clients including sender.
			    });
			}
    	});
	});
});