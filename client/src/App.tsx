import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/");

function App() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [room ,setRoom] = useState("");





  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("send_message", {message, room});
  };
  const handleRoomSubmit = (event) => {
      event.preventDefault();
      if(room !== ""){
        socket.emit("join_room", room)
      }
  };

  useEffect(() => {
    const handleReceiveMessage = (receivedData) => {
      setData((prevData) => [receivedData, ...prevData]);
    };
  
    socket.on("receive_message", handleReceiveMessage);


    
  
    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <>
      
      <form onSubmit={handleRoomSubmit} className="">
        <input
          onChange={(event) => setRoom(event.target.value)}
          placeholder="write room no:"
          name="chat"
          type="text"
        />
        <button type="submit">submit</button>
      </form>

      <form onSubmit={handleSubmit} className="">
        <input
          onChange={(event) => setMessage(event.target.value)}
          placeholder="write something"
          name="chat"
          type="text"
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h1>All Messages</h1>
        {data?.map((msg, index) => {
          return (
            <div key={index}>
              <p>{msg?.message}</p>
            </div>
          );
        
        })}
      </div>
    </>
  );
}

export default App;
