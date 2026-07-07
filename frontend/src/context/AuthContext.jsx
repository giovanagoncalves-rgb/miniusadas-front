import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '@/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('miniusadas_user')) }
    catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    localStorage.setItem('miniusadas_token', data.token)
    localStorage.setItem('miniusadas_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('miniusadas_token')
    localStorage.removeItem('miniusadas_user')
    setUser(null)
  }, [])

  const isAdmin  = user?.role === 'admin'
  const isDealer = user?.role === 'dealer'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isDealer }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
