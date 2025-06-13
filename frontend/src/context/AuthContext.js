"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`)
          setUser(res.data.data)
          setIsAuthenticated(true)
        } catch (err) {
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
          setError("Authentication failed. Please login again.")
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData)

      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.data)
      setIsAuthenticated(true)
      setLoading(false)
      return { success: true }
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Registration failed")
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      }
    }
  }

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true)
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, userData)

      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.data)
      setIsAuthenticated(true)
      setLoading(false)
      return { success: true }
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Login failed")
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      }
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`)
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/profile`, userData)
      setUser(res.data.data)
      setLoading(false)
      return { success: true }
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Profile update failed")
      return {
        success: false,
        message: err.response?.data?.message || "Profile update failed",
      }
    }
  }

  // Clear errors
  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
