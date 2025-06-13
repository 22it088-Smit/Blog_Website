import { Link } from "react-router-dom"
import { format } from "date-fns"

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/blogs/${blog._id}`}>
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${blog.coverImage}`}
          alt={blog.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "https://via.placeholder.com/400x200?text=Blog+Image"
          }}
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{blog.category}</span>
          <span className="text-xs text-gray-500 ml-auto">{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
        </div>
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">{blog.title}</h2>
        </Link>
        <div className="flex items-center mb-3">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${blog.author.avatar}`}
            alt={blog.author.name}
            className="w-8 h-8 rounded-full mr-2"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://via.placeholder.com/40?text=User"
            }}
          />
          <span className="text-sm text-gray-600">{blog.author.name}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            {blog.viewCount}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            {blog.comments?.length || 0}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            {blog.likes?.length || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
