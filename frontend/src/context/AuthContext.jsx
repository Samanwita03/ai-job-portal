import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const storedAuth = () => {
  try {
    const raw = localStorage.getItem('jobportal-auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(storedAuth())

  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem('jobportal-auth', JSON.stringify(auth))
    } else {
      localStorage.removeItem('jobportal-auth')
    }
  }, [auth])

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      login: (data) => setAuth(data),
      logout: () => setAuth(null)
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
