const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cors  = require('cors')
const http = require('http')
const webSocketServer = require('websocket').server;
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
const server = http.createServer()
server.listen(process.env.WS_PORT)
const wsServer = new webSocketServer({
    httpServer : server
})

const itemSchema = new mongoose.Schema({
 text : String,
 userid : Number
})
const Item = mongoose.model('Item',itemSchema)
wsServer.on('request', (request) => {
  const connection = request.accept(null,request.origin)
  console.log('connection established')
  connection.on('message', function(message) {
    console.log(JSON.parse(message.utf8Data))
    // console.log('received message')
       
       const newItem = new Item({
        text : JSON.parse(message.utf8Data).msg,
        userid : JSON.parse(message.utf8Data).userid
       })
      
       newItem.save().then(item => {
        
        wsServer.connections.forEach(client => {
          if (client.connected) {
            client.send(JSON.stringify({
              status: 'Saved To DB',
            }));
          }
        });
       }).catch(err => {
        console.log(err)
       })
  })
})

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });


app.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      return res.status(200).json(items);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
app.get('/',(req,res) => {
    res.send('hello world')
})
app.post('/login', (req,res) => {
  // here we console.log()
  console.log(req.body)
  if(req.body.username === 'abhi' &&  req.body.password === 'abhi') {
    return res.status(200).json({
      message : 'success',
      userid : 1234
    })

  }else {
    return res.status(400).send({
      message : 'Invalid Credentials'
    })
  }
})
app.listen(process.env.APP_PORT,(req,res) => {
   console.log(`server listening on port ${process.env.APP_PORT}`)
}) 