import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const isEmployer = auth?.role === 'EMPLOYER'

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/jobs/all')
      setJobs(response.data)
      setError('')
    } catch (err) {
      setError('Unable to load jobs. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const response = await api.get('/api/jobs/search', {
        params: { title: search }
      })
      setJobs(response.data)
    } catch (err) {
      setError('Search failed. Please try again.')
    }
  }

  return (
    <div className="page-card">
      <div className="section-header">
        <h1>Job Listings</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading && (
        <div style={{textAlign:'center', padding:'2rem',
          color:'var(--text-muted)'}}>
          <span className="loader"></span> Loading jobs...
        </div>
      )}

      {!loading && jobs.length === 0 && !error && (
        <p style={{color:'var(--text-muted)', textAlign:'center',
          padding:'2rem'}}>
          No jobs available yet.
        </p>
      )}

      <div className="grid-list">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <div className="job-card-header">
              <h2>{job.title}</h2>
              {job.jobType && (
                <span className="job-type-badge">
                  {job.jobType.replace('_', ' ')}
                </span>
              )}
            </div>
            <p className="job-card-company">{job.company}</p>
            <p className="job-card-location">📍 {job.location}</p>
            {job.salaryRange && (
              <p className="job-card-salary">💰 {job.salaryRange}</p>
            )}
            {job.skillsRequired && (
              <div className="job-skills">
                {job.skillsRequired.split(',').slice(0, 4).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
            {!isEmployer && (
              <Link to={`/jobs/${job.id}`} className="button-link">
                View & Apply →
              </Link>
            )}
            {isEmployer && (
              <div className="employer-job-note">
                Login as jobseeker to apply
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}