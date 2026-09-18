import React, { useState } from 'react'
import { registerUser } from '../services/authServices'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [name,setName]=useState("")
    const [phone,setPhone]=useState()
    const [role,setRole]=useState()
    const [education,setEducation]=useState("")
    const [college,setCollege]=useState("")
    const [address,setAddress]=useState("")
    const [skills,setSkills]=useState([])
    const [organisation,setOrganisation]=useState("")
    const [organisationDescription,setOrganisationDescription]=useState("")

    const navigate=useNavigate()
    const handleRegister=async(e)=>{
        e.preventDefault()
        try
        {
            let data;
        if(role=="Student"){
             data = await registerUser({name,email,password,phone,role,education,college,address,skills})
        }
        else if(role=="Organiser"){
             data = await registerUser({name,email,password,phone,role,organisation,organisationDescription})
        }
        
        localStorage.setItem("token",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        
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
    const student=(<><label htmlFor="education">Enter your Education</label>
                <input id="education"
                   type="text" 
                   value={education}
                   onChange={(e)=>{setEducation(e.target.value)}}/>
                
                <label htmlFor="college">Enter your College</label>
                <input id="College"
                   type="text" 
                   value={college}
                   onChange={(e)=>{setCollege(e.target.value)}}/>
                
                <label htmlFor="address">Enter your Address</label>
                <input id="address"
                   type="text" 
                   value={address}
                   onChange={(e)=>{setAddress(e.target.value)}}/>
                
                <select name="skills" id="skills" multiple value={skills} onChange={
                    
                    (e)=>{
                        const selectedSkills=Array.from(
                            e.target.selectedOptions,
                            option=> option.value
                        );
                        setSkills(selectedSkills)}}>
                    <option value="React">React</option>
                    <option value="Express">Express</option>
                    <option value="MongoDB">MongoDb</option>
                    <option value="Node.js">Node.js</option>

                </select></>)
    const organiser=(
                <>
                <label htmlFor="organisation">Enter the name of your organisation </label>
                <input id="oragnisation"
                   type="text" 
                   value={organisation}
                   onChange={(e)=>{setOrganisation(e.target.value)}}/>
                
                <label htmlFor="address">Enter description of your organisation</label>
                <input id="organisationDescription"
                   type="text" 
                   value={organisationDescription}
                   onChange={(e)=>{setOrganisationDescription(e.target.value)}}/>
            </> )
    return (
    <div>
        <form onSubmit={handleRegister}>
            <label htmlFor="name">Enter your Name</label>
            <input id="name"
                   type="text" 
                   value={name}
                   onChange={(e)=>{setName(e.target.value)}}/>
            
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
            
            <label htmlFor="phone">Enter your Phone number</label>
            <input id="phone"
                   type="number" 
                   value={phone}
                   onChange={(e)=>{setPhone(e.target.value)}}/>

            <label htmlFor="role">What's describe you the best</label>
            <select name="role" id="role" onChange={(e)=>{setRole(e.target.value)}}>
                <option>Select</option>
                <option value="Student">Student</option>
                <option value="Organiser">Organiser</option>
            </select>
            
            
            
            {role=="Student" && student}
            {role=="Organiser" && organiser}
            

            <button type="submit">Submit</button>
        </form>
    </div>
    )
}

export default Register
