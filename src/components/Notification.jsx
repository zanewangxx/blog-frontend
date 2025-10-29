const Notification = ({ notification }) => {
  if (!notification) return null

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: '#f0f0f0',
    border: `2px solid ${notification.type === 'error' ? 'red' : 'green'}`,
    padding: '8px',
    margin: '10px 0',
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification