"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import CommentForm from "../components/blog/CommentForm"
import Comment from "../components/blog/Comment"
import Spinner from "../components/common/Spinner"

const BlogDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useContext(AuthContext)
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [likeLoading, setLikeLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlog()
    fetchComments()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`)
      setBlog(response.data.data)

      // Check if user has liked/disliked the blog
      if (user) {
        setIsLiked(response.data.data.likes.includes(user._id))
        setIsDisliked(response.data.data.dislikes.includes(user._id))
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
      toast.error("Blog not found")
      navigate("/blogs")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}/comments`)
      setComments(response.data.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this blog")
      return
    }

    try {
      setLikeLoading(true)
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blogs/${id}/like`)
      const { isLiked: newIsLiked, isDisliked: newIsDisliked, likes, dislikes } = response.data.data

      setIsLiked(newIsLiked)
      setIsDisliked(newIsDisliked)
      setBlog((prev) => ({
        ...prev,
        likes: Array(likes).fill(null),
        dislikes: Array(dislikes).fill(null),
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like blog")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to dislike this blog")
      return
    }

    try {
      setLikeLoading(true)
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blogs/${id}/dislike`)
      const { isLiked: newIsLiked, isDisliked: newIsDisliked, likes, dislikes } = response.data.data

      setIsLiked(newIsLiked)
      setIsDisliked(newIsDisliked)
      setBlog((prev) => ({
        ...prev,
        likes: Array(likes).fill(null),
        dislikes: Array(dislikes).fill(null),
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to dislike blog")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev])
  }

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId))
  }

  const handleReplyAdded = (reply) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id === reply.parent) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          }
        }
        return comment
      }),
    )
  }

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}/export/${format}`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `blog-${id}.${format === "excel" ? "xlsx" : "docx"}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(`Blog exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export blog as ${format.toUpperCase()}`)
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
          <Link to="/blogs" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Back to blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Blog Header */}
          <div className="relative">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${blog.coverImage}`}
              alt={blog.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image"
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <span className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-2">
                  {blog.category}
                </span>
                <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
              </div>
            </div>
          </div>

          {/* Blog Meta */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${blog.author.avatar}`}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/48?text=User"
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{blog.author.name}</p>
                  <p className="text-sm text-gray-500">{format(new Date(blog.createdAt), "MMMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {blog.viewCount} views
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {comments.length} comments
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isLiked ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {blog.likes?.length || 0}
                </button>
                <button
                  onClick={handleDislike}
                  disabled={likeLoading}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isDisliked ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                  {blog.dislikes?.length || 0}
                </button>
              </div>

              {/* Export and Edit Buttons */}
              <div className="flex items-center space-x-2">
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => handleExport("excel")}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleExport("word")}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Export Word
                    </button>
                  </>
                )}
                {(user?._id === blog.author._id || user?.role === "admin") && (
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="p-6">
            <div
              className="prose prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

          {isAuthenticated ? (
            <CommentForm blogId={id} onCommentAdded={handleCommentAdded} />
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-600">
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>{" "}
                to leave a comment.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  blogId={id}
                  onCommentDeleted={handleCommentDeleted}
                  onReplyAdded={handleReplyAdded}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
