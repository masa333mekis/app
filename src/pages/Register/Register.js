import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"

export default function Register() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "",
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

  useEffect(() => {
    localStorage.removeItem("token")
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post("http://localhost:3002/register", { ...user })
      if (result.status === 200) {
        toast(result.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      
    }} catch (error) {
      if (error.response.status === 400) {
        toast(error.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        navigate("/register")
      } else {
        console.error(error)
        toast("An error occurred. Please try again later.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        navigate("/register")
      }
    }
  }
  
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label htmlFor="name">Username</label>
        <input
          type="text"
          onChange={handleChange}
          name="name"
          id="name"
        />
        <label htmlFor="email">Email</label>
        <input type="email" onChange={handleChange} name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          onChange={handleChange}
          name="password"
          id="password"
        />
        <input type="submit" value="Register" />
        <Link to="/login" className="link-tag">
          Login
        </Link>
      </form>
    </>
  )
}
