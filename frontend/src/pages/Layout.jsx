import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { auth, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isEmployer = auth?.role === 'EMPLOYER'
  const isJobseeker = auth?.role === 'JOBSEEKER'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">AI Job Portal</div>
        <nav>
          <Link to="/jobs">Jobs</Link>
          {isEmployer && <Link to="/employer">Employer</Link>}
          {isJobseeker && <Link to="/my-applications">My Applications</Link>}
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {!isAuthenticated && <Link to="/register">Register</Link>}
          {isAuthenticated && (
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>
      <main className="app-main">
        <div className="welcome-banner">
          {isAuthenticated ? (
            <p>Welcome back, {auth.fullName}!</p>
          ) : (
            <p>Please login or register to continue.</p>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  )
}