"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import BlogForm from "../components/blog/BlogForm"

const CreateBlog = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Blog created successfully!")
      navigate(`/blogs/${response.data.data._id}`)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create blog")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>
          <BlogForm onSubmit={handleSubmit} buttonText="Create Blog" />
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
