import axios from 'axios'
import React, { useState } from 'react'

const Signup = () => {
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [username,setUsername] = useState("")
    const handleSignUp = (e) => {
       e.preventDefault()
       // here we handle the signup event
       axios.post('http://localhost:3000/signup', {
          name : name,
          username : username,
          password : password
       }).then(result => {
        console.log(result)
       }).catch(err => {
        console.log(err)
       });
    } 
     return (
    <div>
      {/* we setup the signup mechanism here */}
      <form onSubmit={handleSignUp}>
        <input value={name} onChange={(e) => setName(e.target.value)}/>
        <input value={username} onChange={(e) => setUsername(e.target.value)}/>
        
         <input value={password} onChange={(e) => setPassword(e.target.value)}/>
         
         <button type='submit'>Sign up</button>
        
      </form>
    </div>
  )
}

export default Signup
