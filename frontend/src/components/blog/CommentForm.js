"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { toast } from "react-toastify"

const CommentForm = ({ blogId, onCommentAdded, parentId = null }) => {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: Yup.object({
      content: Yup.string().required("Comment is required").max(500, "Comment must be 500 characters or less"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}/comments`, {
          content: values.content,
          parentId: parentId,
        })

        resetForm()
        onCommentAdded(response.data.data)
        toast.success("Comment added successfully")
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add comment")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          {parentId ? "Write a reply" : "Leave a comment"}
        </label>
        <textarea
          id="content"
          name="content"
          rows="3"
          className={`w-full px-3 py-2 border ${
            formik.touched.content && formik.errors.content ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Write your comment here..."
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
        {formik.touched.content && formik.errors.content && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
        )}
      </div>
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
          "Submit"
        )}
      </button>
    </form>
  )
}

export default CommentForm
