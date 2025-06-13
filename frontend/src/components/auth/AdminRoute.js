"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"
import Spinner from "../common/Spinner"

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" />
  }

  return children
}

export default AdminRoute
