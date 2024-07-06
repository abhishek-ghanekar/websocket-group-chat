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
      wsServer.connections.forEach(client => {
        if (connection != client && client.connected) {
          
          client.send(message.utf8Data);
        }
      });
    
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
app.post('/login', async (req,res) => {
  // here we console.log()
  // console.log(req.body)
  // if(req.body.username === 'abhi' &&  req.body.password === 'abhi') {
  //   return res.status(200).json({
  //     message : 'success',
  //     userid : 1234
  //   })
   
  // }else if(req.body.username === 'test' && req.body.password === 'test') {
  //   return res.status(200).json({
  //     message : 'success',
  //     userid : 1235
  //   })
  // }else {
  //   return res.status(400).send({
  //     message : 'Invalid Credentials'
  //   })
  // }
  const {username,password} = req.body
  try {
     const user = await User.findOne({username,password}).exec();
     if(user) {
       return res.status(200).json({
        userid : user.userid
       })
     }else {
        return res.status(401).json({
          message : 'invalid username of password'
        })
     }
  }catch (error) {
    return res.status(500).json({message : 'an error occured during login'})
  }
})

const userSchema = new mongoose.Schema({
  username : String,
  name : String,
  password : String,
  userid : Number
 })
 const User = mongoose.model('User',userSchema)
 
 

app.post('/signup',async (req,res) => {
  // here we do the signup process
  const data = req.body;
  console.log(data)
  // const cnt = await  User.countDocuments() + 1;
  const maxUser = await User.findOne().sort('-userid').exec();
  
  const cnt = maxUser ? maxUser.userid + 1 : 1
  const newUser = new User({
    username : req.body.username,
    name : req.body.name,
    password : req.body.password,
    userid : cnt
  })
  newUser.save().then(item => {
    return res.status(200).json({
      message : 'signed in successfully!'
    })
  }).catch(err => {
    return res.status(400).json(err)
  })
  
})
app.post('/sendmessage', (req,res) => {
  // we get the message her
  const newItem = new Item({
    text : req.body.message,
    userid : req.body.userid
   })
  
   newItem.save().then(item => {
    
    wsServer.connections.forEach(client => {
      if (client.connected) {
        client.send(JSON.stringify({
          action : 'saved',
          status: 'Saved To DB',
        }));
        
      }
    });
   }).catch(err => {
    console.log(err)
   })
})
app.listen(process.env.APP_PORT,(req,res) => {
   console.log(`server listening on port ${process.env.APP_PORT}`)
}) 