import { useState } from "react";
import {useNavigate } from "react-router-dom"
import { loginUser } from "../services/userService";
import {useUser}  from "../context/UserContext"

function LoginPage() {
    const navigate = useNavigate()
    const {login}  = useUser()

    const [formData, setFormData] = useState({
      email: "",
      password: "",
    })

    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e)=>{
      setFormData((prev)=>({
        ...prev,
        [e.target.name]:e.target.value,
      }))
    }
    const handleSubmit = async (e)=>{
      e.preventDefault()
      setErrorMessage("")
      
      try{
        const data = await loginUser(formData.email, formData.password)
        login(data)
        navigate("/")
      }catch (error){
        setErrorMessage(
          error.response?.data?.message || "Login faild"
        )
      }
    }
    return(
      <div>
        <h2>Login Page</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label >Email:</label>
            <br />
            <input
             type="email" 
             name= "email"
             value={formData.email}
             onChange={handleChange}
            />
          </div>

          <br />

          <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit"> Login</button>
 
        </form>

        {errorMessage && <p>{errorMessage}</p>}
      </div>
    )
}
  
  export default LoginPage;