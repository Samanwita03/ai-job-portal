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

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      login(response.data)
      navigate('/jobs')
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="auth-brand">
          <div className="auth-brand-logo">🚀</div>
          <h2>AI Job Portal</h2>
          <p>Find your dream job with AI-powered resume matching and smart insights.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🤖</div>
              <span>AI Resume Analysis & Matching</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📊</div>
              <span>Real-time ATS Score</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">⚡</div>
              <span>Instant Skill Gap Analysis</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🎯</div>
              <span>Smart Job Recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
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
          <p style={{textAlign:'center', marginTop:'1rem',
            color:'var(--text-secondary)', fontSize:'0.875rem'}}>
            New here? <Link to="/register"
              style={{color:'var(--accent-primary)'}}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}