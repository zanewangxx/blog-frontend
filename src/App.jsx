import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()
  const loginFormRef = useRef()

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification({ message: `A new blog "${newBlog.title}" added!`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({ message: 'failed to create new blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleRemoveBlog = async (blog) => {
    console.log('Trying to delete blog id:', blog.id, 'title:', blog.title)
    try {
      await blogService.remove(blog.id)
      setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
      setNotification({ message: `Blog "${blog.title}" removed!`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification({ message: 'failed to remove blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification notification={notification} />
      {!user && (
        <Togglable buttonLabel="login" ref={loginFormRef}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>)}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <h2>Create New Blog</h2>
          <Togglable buttonLabel='New Blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2>Blog List</h2>
          <BlogList blogs={blogs} onRemove={handleRemoveBlog} />
        </div>
      )}
    </div>
  )
}

export default App
