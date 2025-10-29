import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, onRemove }) => {
  return (
    <div>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} onRemove={onRemove}/>
      ))}
    </div>
  )
}

export default BlogList
