import { useState } from "react"
import { loginUser } from "../services/authServices.js"
import {useNavigate,Link} from "react-router-dom"
import React from 'react'

function Login() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    const handleLogin=async(e)=>{
        e.preventDefault()
        try
        {const data = await loginUser({email,password})
        localStorage.setItem("token",data.tokens)
        localStorage.setItem("user",JSON.stringify(data.user))
        const role=data.user.role
        if(role=="Student"){
            navigate("/studentDashboard")
        }
        else{
            navigate("/organiserDashboard")
        }
            }   
        catch{
        }
        
    }
    return (
    <div>
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Enter your Email</label>
            <input id="email"
                   type="email" 
                   value={email}
                   onChange={(e)=>{setEmail(e.target.value)}}/>

            <label htmlFor="password">Enter password</label>
            <input id="password"
                   type="password"
                   value={password}
                   onChange={(e)=>{setPassword(e.target.value)}} />
            <button type="submit">Submit</button>
        </form>
    </div>
    )
}

export default Login
