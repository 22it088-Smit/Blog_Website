"use client"

import { useState, useContext } from "react"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "react-toastify"
import AuthContext from "../../context/AuthContext"
import CommentForm from "./CommentForm"

const Comment = ({ comment, blogId, onCommentDeleted, onReplyAdded }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        setLoading(true)
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${comment._id}`)
        onCommentDeleted(comment._id)
        toast.success("Comment deleted successfully")
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete comment")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleReplyAdded = (reply) => {
    onReplyAdded(reply)
    setShowReplyForm(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-start">
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${comment.user.avatar}`}
          alt={comment.user.name}
          className="w-10 h-10 rounded-full mr-3"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "https://via.placeholder.com/40?text=User"
          }}
        />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h4 className="font-bold text-gray-800">{comment.user.name}</h4>
            <span className="text-xs text-gray-500 ml-2">
              {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>
          <div className="flex items-center text-sm">
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-blue-600 hover:text-blue-800 mr-4">
              Reply
            </button>
            {(user?._id === comment.user._id || user?.role === "admin") && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin mr-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
            )}
          </div>
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm blogId={blogId} parentId={comment._id} onCommentAdded={handleReplyAdded} />
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  blogId={blogId}
                  onCommentDeleted={onCommentDeleted}
                  onReplyAdded={onReplyAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comment
