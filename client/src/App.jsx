import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Protected from './components/Protected.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

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
