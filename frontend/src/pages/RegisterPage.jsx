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
    setLoading(true)
    try {
      const response = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
        role
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
    <div className="form-page">
      <h1>Create Account</h1>
      <p className="form-subtitle">Join the AI Job Portal today</p>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Saman Nanda"
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
            placeholder="••••••••"
            required
          />
        </label>
        <label>
          I am a...
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="JOBSEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer / Recruiter</option>
          </select>
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading && <span className="loader"></span>}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}