import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const login = (u, t) => {
    setUser(u)
    setToken(t)
  }
  const logout = () => {
    setUser(null)
    setToken('')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
