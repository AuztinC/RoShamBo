import React, {useState} from "react"
import './index.css';
import socketClient  from "socket.io-client";
const socket = socketClient.connect("http://localhost:3001/");

function App() {
  
  const [P1, setP1] = useState("")
  const [P2, setP2] = useState("")
  
  const [enemy, setEnemy] = useState("");
  
  socket.on("assign_player", (data) => {
    
    let pn = data.indexOf(socket.id)
    
    console.log("You are user #" + pn)
    console.log("Your user id is " + socket.id)
  })
  
  socket.on("p1_success", p1 => {
    console.log(p1 + " set as Player 1")
    setP1(p1)
  })
  
  socket.on("p1_fail", p1 => {
    console.log(p1 + " failed to set as Player 2")
  })
  
  socket.on("p2_success", p2 => {
    setP2(p2)
  })
  
  socket.on("p2_fail", p2 => {
    console.log(p2 + " failed to set as Player 2")
  })
  
  function handleClick(hand) {
    socket.emit("send_message", hand)
  }
    
  return (
    <div className="App">
      <div className="p-wrap">
        <button onClick={() => {socket.emit("setP1", socket.id)}} className="playerBtn">PLAYER WON</button>
        <div className="p-id">{P1}</div>
      </div>
      <div className="p-wrap">
        <button onClick={() => {socket.emit("setP2", socket.id)}} className="playerBtn">PLAYER TOO</button>
        <div className="p-id">{P2}</div>
      </div>
      {/* {console.log(socket.id)} */}
      
      <div id="enemy">🖐</div>
      
      <div className="hand-wrap">
        <button onClick={() => {handleClick("✊")}} className="gameBtn rock">✊</button>
        <button onClick={() => {handleClick("✋")}} className="gameBtn paper">✋</button>
        <button onClick={() => {handleClick("✌")}} className="gameBtn scissors">✌</button>
      </div>
    </div>
  );
}

export default App;
