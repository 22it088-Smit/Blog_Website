"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import BlogForm from "../components/blog/BlogForm"
import Spinner from "../components/common/Spinner"

const EditBlog = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`)
      const blogData = response.data.data

      // Check if user is authorized to edit
      if (blogData.author._id !== user?._id && user?.role !== "admin") {
        toast.error("You are not authorized to edit this blog")
        navigate("/blogs")
        return
      }

      setBlog(blogData)
    } catch (error) {
      console.error("Error fetching blog:", error)
      toast.error("Blog not found")
      navigate("/blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Blog updated successfully!")
      navigate(`/blogs/${response.data.data._id}`)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update blog")
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Blog not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
          <BlogForm initialValues={blog} onSubmit={handleSubmit} buttonText="Update Blog" />
        </div>
      </div>
    </div>
  )
}

export default EditBlog
