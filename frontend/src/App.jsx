import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './pages/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import EmployerDashboardPage from './pages/EmployerDashboardPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/jobs" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="jobs" element={<PrivateRoute component={JobsPage} />} />
          <Route path="jobs/:id" element={<PrivateRoute component={JobDetailsPage} />} />
          <Route path="employer" element={<PrivateRoute component={EmployerDashboardPage} />} />
          <Route path="my-applications" element={<PrivateRoute component={MyApplicationsPage} />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App