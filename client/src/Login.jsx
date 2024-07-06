import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate } from 'react-router-dom'
import {ToastContainer ,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // we make a login endpoint on the backend
        // here we do whatever
        axios.post('http://localhost:3000/login',{
            username: username,
            password: password
          }).then(result => {
        //    console.log(result)
               // set values in localstorage
               console.log(result.data)
               sessionStorage.setItem('userid', result.data.userid)
               navigate('/home')
            
        }).catch(err => {
            // toast.error('err')

            toast.error(err.response.data.message)
            // console.log(err.response.data)
        }) 
        
    }
  return (
    <div>
      {/* here we have the login page  */}
      <form onSubmit={handleSubmit}>
         <input value={username} onChange={(e) => setUsername(e.target.value)}/>
         <input value={password} onChange={(e) => setPassword(e.target.value)}/>
         <button type='submit'>Login </button>
         <button onClick={() => { navigate('/signup')}}>Sign Up</button>
         <ToastContainer/>
      </form>
    </div>
  )
}

export default Login
