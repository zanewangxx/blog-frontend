import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
      user: blog.user.id || blog.user
    }
    try{
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(returnedBlog.likes)
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        onRemove(blog)
      } catch (error) {
        console.error('Error removing blog:', error)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <a href={blog.url} target="_blank">{blog.url}</a>
          <p>
            {likes} likes{' '}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.author}</p>
          <button onClick={handleRemove}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
