import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value
    setUser({
      ...user,
      [key]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
    const result = await axios.post("http://localhost:3002/login", { ...user })
    if (result.status === 200) {
      toast(result.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    localStorage.setItem("authToken", result.data.token)
      navigate("/")
  }}
    catch(error) {
       if (error.response.status === 401) {
          toast(error.response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          console.error(error)
          toast("An error occurred. Please try again later.", {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
         
    }
  }
}
  
  useEffect(() => {
    localStorage.removeItem("token")
  }, [])

  return (
    <>
      <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="name">Email</label>
        <input type="text" name="email" id="email" onChange={handleChange} />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
        />
        <input type="submit" value="Login" />
        <Link to="/register" className="link-tag">
          Register
        </Link>
      </form>
    </>
  )
}
