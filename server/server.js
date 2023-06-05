
var app = require('express')();
var http = require('http').createServer(app);
var { Server } = require('socket.io');
const cors = require("cors")

app.use(cors());

let users = []

let p1 = ""
let p2 = ""


const io = new Server(http, {
	cors: {
		origin: "http://localhost:3000",
		method: ['GET', 'POST']
	}
})

io.on('connection', (socket) => {
	users.push(socket.id)
	console.log(socket.id + " has connected")
	socket.emit("assign_player", users)
	socket.on("send_message", (data) => {
		console.log(socket.id + " plays " + data)
	})
	
	socket.on("setP1", P1 => {
		if (p1 === "") {
			p1 = P1;
			console.log("Player 1 is " + P1)
			socket.broadcast.emit("p1_success", p1)
			socket.emit("p1_success", p1)
		} else {
			socket.emit("p1_fail", p1)
		}
	})
	socket.on("setP2", P2 => {
		if (p2 === "") {
			p2 = P2;
			console.log("Player 2 is " + P2)
			socket.broadcast.emit("p2_success", p2)
			socket.emit("p2_success", p2)
		} else {
			socket.emit("p2_fail", p2)
		}
	})
	
	socket.on("disconnect", () => {
		users.splice(users.indexOf(socket.id)-1, 1)
		
		if (socket.id === p1) {
			p1 = ""
		}
		if (socket.id === p2) {
			p2 = ""
		}
		console.log(socket.id + " has disconnected")
	})
})



http.listen(3001, () => {
	console.log("Connected")
})
