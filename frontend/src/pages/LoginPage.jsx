import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      login(response.data)
      navigate('/jobs')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <h1>Welcome Back</h1>
      <p className="form-subtitle">Sign in to your account</p>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading && <span className="loader"></span>}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}