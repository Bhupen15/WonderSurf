import React from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

const Protected = ({ children, role }) => {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (role && user.role !== role) return <Navigate to="/products" replace />
  return children
}

const Nav = () => {
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

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<div>Welcome to MERN E-commerce</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Protected><Products /></Protected>} />
        <Route path="/admin/users" element={<Protected role="admin"><AdminUsers /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
