import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/userService";
import { useUser } from "../context/UserContext"
import { Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useUser()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    try {
      const data = await loginUser(formData.email, formData.password)
      login(data)
      navigate("/")
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login faild"
      )
    }
  }
  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {errorMessage && (
          <p style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Sign In</button>

        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage;