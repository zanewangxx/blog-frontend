import React from 'react'

const Blog = ({blog}) => {
  return (
    <div>
      <li>
        {blog.url} {blog.title} by {blog.author}
      </li>
    </div>
  )
}

export default Blog
