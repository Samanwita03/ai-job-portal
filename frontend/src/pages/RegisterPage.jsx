import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('JOBSEEKER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
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
      const response = await api.post('/api/auth/register', {
        fullName, email, password, role
      })
      if (response.data && response.data.token) {
        login(response.data)
        navigate('/jobs')
      } else {
        setError('Registration failed. Try another email.')
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 500) {
        setError('This email is already registered. Please login instead.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left Side */}
      <div className="auth-left">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="auth-brand">
          <div className="auth-brand-logo">✨</div>
          <h2>Join AI Job Portal</h2>
          <p>Create your account and let AI help you land your dream job faster.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📄</div>
              <span>Upload PDF Resume</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🎯</div>
              <span>AI Match Score for Every Job</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📈</div>
              <span>Track All Applications</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🔔</div>
              <span>Get Shortlisted Faster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="form-page">
          <h1>Create Account</h1>
          <p className="form-subtitle">Join thousands of job seekers</p>
          <form onSubmit={handleSubmit} className="form-card">
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </label>
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
                placeholder="Min 6 characters"
                required
              />
            </label>
            <label>
              I am a...
              <select value={role}
                onChange={(e) => setRole(e.target.value)}>
                <option value="JOBSEEKER">👤 Job Seeker</option>
                <option value="EMPLOYER">🏢 Employer / Recruiter</option>
              </select>
            </label>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading && <span className="loader"></span>}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{textAlign:'center', marginTop:'1rem',
            color:'var(--text-secondary)', fontSize:'0.875rem'}}>
            Already have an account?{' '}
            <Link to="/login"
              style={{color:'var(--accent-primary)'}}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}