"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import BlogCard from "../components/blog/BlogCard"
import Spinner from "../components/common/Spinner"

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [popularBlogs, setPopularBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)

        // Fetch recent blogs
        const recentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs?page=1&limit=6`)
        setRecentBlogs(recentResponse.data.data)

        // Use the first 3 blogs as featured
        setFeaturedBlogs(recentResponse.data.data.slice(0, 3))

        // Fetch popular blogs (most viewed)
        const popularResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs?page=1&limit=4&sort=viewCount`)
        setPopularBlogs(popularResponse.data.data)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">Welcome to BlogApp</h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Share your thoughts, ideas, and stories with the world.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/blogs"
                className="inline-block bg-white text-blue-600 px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-blue-50 md:text-lg"
              >
                Explore Blogs
              </Link>
              <Link
                to="/register"
                className="inline-block ml-4 bg-blue-800 text-white px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-blue-700 md:text-lg"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent & Popular Blogs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Recent Blogs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  View All Blogs
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Popular Blogs</h2>
              <div className="space-y-6">
                {popularBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-center bg-white p-4 rounded-lg shadow">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${blog.coverImage}`}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/64?text=Blog"
                      }}
                    />
                    <div>
                      <Link to={`/blogs/${blog._id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
                        {blog.title}
                      </Link>
                      <p className="text-sm text-gray-500">{blog.viewCount} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to share your story?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our community of writers and readers. Create an account to start sharing your thoughts with the world.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-blue-50 md:text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
