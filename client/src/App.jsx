
import { useEffect, useState } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios"
const client = new W3CWebSocket('ws://127.0.0.1:8000');
function App() {
  const [messages,setMessages] = useState([])
  const [text,setText] = useState("")
  client.onmessage = (event) => {
    console.log(JSON.parse(event.data))
    fetchData()
    // console.log('message recieved')
  }
  
  const fetchData = async () => {

      axios.get('http://localhost:3000/items')
      .then(response => {
        // console.log(response)
        setMessages(response.data)
        // console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    fetchData()
    return () => {
      client.close();
      console.log('WebSocket Client Disconnected');
    };
      console.log('component mounted')
  },[])
  const handleButtonClick = (e) => {
    e.preventDefault()
    client.send(JSON.stringify({
      msg : text,
      userid : 1234
    }))
  }
  return (
    <>
      <h1>React App</h1>
      <form onSubmit={handleButtonClick}>
      <input value={text} onChange={(e) => setText(e.target.value)}/>
       <button  type="submit">Click me</button>
      </form>
      {messages && messages.map((item) => {
         return <p>{item.text}</p>
      })}
    </>
  )
}

export default App
