import { useEffect, useState , useRef} from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios"
import Avatar, { genConfig } from 'react-nice-avatar'
const client = new W3CWebSocket('ws://127.0.0.1:8000');
const Home = () => {
    const config = genConfig() 
    const userid = sessionStorage.getItem('userid')
    const typingTimeoutRef = useRef(null);
    
    const [messages,setMessages] = useState([])
    const [text,setText] = useState("")
    client.onmessage = (event) => {
      console.log(JSON.parse(event.data))
      const temp =JSON.parse(event.data)
      if(temp.action === 'typing') {
        setTypingState(temp.name)
      }else {
        fetchData()
      }
      // console.log('message recieved')
    }
    let typingTimeout;
    const [typing,setTyping] = useState("")
    const setTypingState = (txt) => {
        // in this we set the typing state
        setTyping(txt);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setTyping("");
    }, 3000);
        
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
      axios.post('http://localhost:3000/sendmessage',{
        message: text,
        userid: userid
      }).then(result => {
        console.log('message sent')
      }).catch(err=> {
        console.log(err)
      })
    //   client.send(JSON.stringify({
    //     msg : text,
    //     userid : userid
    //   }))
      setText("")
    }
    const handleKeyPress = (e) => {
        // here we handle the key press operation
        console.log(e)
        
        client.send(JSON.stringify({
            action : 'typing',
            name : 'abhishek'
        }))
    }
  return (
    <>
    <div className="bg-rose-200">
    {typing != "" && 
    <p>{typing} is Typing....</p>}

    <h1 >Send A Message </h1>
    <form onSubmit={handleButtonClick}>
    <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyPress}/>
     <button  type="submit">Send</button>
    </form>
    <div className="flex flex-col gap-2 h-[600px] overflow-auto">
    {messages && messages.map((item) => {
     {console.log(item.userid)}
       return <div className={`${item.userid == userid ? 'self-end' : 'self-start'} flex w-[200px] bg-white rounded-md`} >
              <Avatar style={{ width: '2rem', height: '2rem' }} {...config} />
              <p>
        {item.text}
        </p>
        
        </div> 
    })}
    </div>
    </div>
  </>
  )
}

export default Home
