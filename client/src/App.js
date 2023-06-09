import React, {useState, useEffect} from "react"
import './index.css';
import socketClient  from "socket.io-client";
const socket = socketClient.connect("http://localhost:3001/");

function App() {
  
  const [P1, setP1] = useState({id: "", hand: "🖐"})
  const [P2, setP2] = useState({id: "", hand: "🖐"})
  const [localHand, setLocalHand] = useState("🖐")
  const [enemyHand, setEnemyHand] = useState("🖐")
  
  
  // Setting client as Player 1 has succeeded
  // Set local P1 state
  
  socket.on("p1_success", p1 => {
    let id = p1.id
    let hand = P1.hand
    setP1({id, hand})
  })
  
  // Setting client as Player 1 has failed
  // Do nothing
  
  socket.on("p1_fail", p1 => {
    console.log(p1.id + " failed to set as Player 2")
  })
  
  // Setting client as Player 2 has succeeded
  // Set local P2 state
  
  socket.on("p2_success", p2 => {
    let id = p2.id
    let hand = P2.hand
    setP2({id, hand})
  })
  
  socket.on("p2_fail", p2 => {
    console.log(p2.id + " failed to set as Player 2")
  })
  
  // When server broadcasts other player's hand
  
  socket.on("recieve_hand", ([p1, p2]) => {
    // console.log(p1)
    setP1(p1)
    setP2(p2)
    
    if (socket.id == p1.id) {
      setEnemyHand(p2.hand)
    } else if (socket.id == p2.id) {
      setEnemyHand(p1.hand)
    } else {
      setLocalHand(p1.hand)
      setEnemyHand(p2.hand)
    }
    
  })
  
  // When user clicks a button to choose hand
  
  function handleClick(hand) {
    
    if (socket.id == P1.id) {
      let id = P1.id;
      setP1({id, hand})
    }
    if (socket.id == P2.id) {
      let id = P2.id;
      setP2({id, hand})
    }
    
    // socket.emit("send_hand", hand)
  }
  
  useEffect(() => {
    if (socket.id == P1.id) {
      setLocalHand(P1.hand)
    }
    if (socket.id == P2.id) {
      setLocalHand(P2.hand)
    }
  }, [P1, P2])

  
  function handleSubmit(){
    socket.emit("submit_hand", localHand)
  }
  
    
  return (
    <div className="App">
      <div className="p-wrap">
        <button onClick={() => {socket.emit("setP1", socket.id)}} className="playerBtn">PLAYER WON</button>
        <div className="p-id">{P1.id}</div>
      </div>
      <div className="p-wrap">
        <button onClick={() => {socket.emit("setP2", socket.id)}} className="playerBtn">PLAYER TOO</button>
        <div className="p-id">{P2.id}</div>
      </div>
      {/* {console.log(socket.id)} */}
      
      <div id="enemy-hand">{enemyHand}</div>
      <div id="local-hand">{localHand}</div>
      
      <div className="hand-wrap">
        <button onClick={() => {handleClick("✊")}} className="gameBtn rock">✊</button>
        <button onClick={() => {handleClick("✋")}} className="gameBtn paper">✋</button>
        <button onClick={() => {handleClick("✌")}} className="gameBtn scissors">✌</button>
      </div>
      <button onClick={() => {handleSubmit()}}>Submit</button>
    </div>
  );
}

export default App;
