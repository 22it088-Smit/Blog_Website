"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import axios from "axios"
import { toast } from "react-toastify"

const BlogForm = ({ initialValues, onSubmit, buttonText = "Submit" }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/categories`)
        setCategories(response.data.data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()

    // Set image preview if editing
    if (initialValues?.coverImage) {
      setImagePreview(`${process.env.REACT_APP_API_URL}/uploads/${initialValues.coverImage}`)
    }
  }, [initialValues])

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      content: initialValues?.content || "",
      category: initialValues?.category || "",
      tags: initialValues?.tags?.join(", ") || "",
      coverImage: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required").max(100, "Title must be 100 characters or less"),
      content: Yup.string().required("Content is required"),
      category: Yup.string().required("Category is required"),
      tags: Yup.string(),
      coverImage: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)

        // Create form data for file upload
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("content", values.content)
        formData.append("category", values.category)
        formData.append("tags", values.tags)

        if (values.coverImage) {
          formData.append("coverImage", values.coverImage)
        }

        await onSubmit(formData)
      } catch (error) {
        toast.error(error.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    },
  })

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0]
    if (file) {
      formik.setFieldValue("coverImage", file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            formik.touched.title && formik.errors.title ? "border-red-500" : ""
          }`}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            formik.touched.category && formik.errors.category ? "border-red-500" : ""
          }`}
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formik.values.tags}
          onChange={formik.handleChange}
          placeholder="technology, programming, web development"
        />
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Cover preview"
              className="h-40 w-auto object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <ReactQuill
          id="content"
          theme="snow"
          modules={modules}
          value={formik.values.content}
          onChange={(content) => formik.setFieldValue("content", content)}
          className={`mt-1 block ${formik.touched.content && formik.errors.content ? "border-red-500" : ""}`}
        />
        {formik.touched.content && formik.errors.content && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  )
}

export default BlogForm
