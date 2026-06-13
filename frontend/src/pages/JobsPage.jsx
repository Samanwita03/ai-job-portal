import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/jobs/all')
      setJobs(response.data)
    } catch (err) {
      setError('Unable to load jobs. Check backend connection.')
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
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="grid-list">
        {jobs.length === 0 && <p>No jobs available yet.</p>}
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <Link to={`/jobs/${job.id}`} className="button-link">
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
