
var app = require('express')();
var http = require('http').createServer(app);
var { Server } = require('socket.io');
const cors = require("cors")

app.use(cors());

let users = []

let p1 = {id: "", hand: ""}
let p2 = {id: "", hand: ""}


const io = new Server(http, {
	cors: {
		origin: "http://localhost:3000",
		method: ['GET', 'POST']
	}
})

io.on('connection', (socket) => {

	users.push(socket.id)
	console.log(socket.id + " has connected")

	socket.on("send_hand", (hand) => {
		// if (socket.id === p1.id){
		// 	p1.hand = hand;
		// }
		// if (socket.id === p2.id){
		// 	p2.hand = hand;
		// }

		// console.log(socket.id + " plays " + data)
		console.log(p2.hand)
	})

	socket.on("submit_hand", (hand) => {


		if (socket.id === p1.id){
			p1.hand = hand;
		}
		if (socket.id === p2.id){
			p2.hand = hand;
		}

		setTimeout(function() {
			if (p1.hand !== "" && p2.hand !== "") {
				socket.broadcast.emit("recieve_hand", [p1, p2])
				socket.emit("recieve_hand", [p1, p2])
				p1.hand = ""
				p2.hand = ""
			}
		}, 1000)

	})

	socket.on("setP1", P1 => {
		if (p1.id === "") {
			p1.id = P1;
			console.log("Player 1 is " + P1)
			socket.broadcast.emit("p1_success", p1)
			socket.emit("p1_success", p1)
		} else {
			socket.emit("p1_fail", p1)
		}
	})
	socket.on("setP2", P2 => {
		if (p2.id === "") {
			p2.id = P2;
			console.log("Player 2 is " + P2)
			socket.broadcast.emit("p2_success", p2)
			socket.emit("p2_success", p2)
		} else {
			socket.emit("p2_fail", p2)
		}
	})

	socket.on("disconnect", () => {
		users.splice(users.indexOf(socket.id)-1, 1)

		if (socket.id === p1.id) {
			p1.id = ""
		}
		if (socket.id === p2.id) {
			p2.id = ""
		}



		console.log(socket.id + " has disconnected")
	})
})



http.listen(3001, () => {
	console.log("Connected")
})
