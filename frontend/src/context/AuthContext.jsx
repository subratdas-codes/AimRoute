import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('aimroute_token'))

  function login(accessToken) {
    localStorage.setItem('aimroute_token', accessToken)
    setToken(accessToken)
  }

  function logout() {
    localStorage.removeItem('aimroute_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
