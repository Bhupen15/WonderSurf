import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Nav() {
  const { user, logout } = useAuth()
  return (
    <nav style={{ marginBottom: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {user?.role === 'admin' && <Link to="/admin/users">Users</Link>}
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && (
        <>
          <span style={{ marginLeft: 12 }}>Hi, {user.name} ({user.role})</span>
          <button style={{ marginLeft: 12 }} onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  )
}
