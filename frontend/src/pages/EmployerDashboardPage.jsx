import { useEffect, useState } from 'react'
import api from '../services/api'

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchEmployerJobs()
  }, [])

  const fetchEmployerJobs = async () => {
    try {
      const response = await api.get('/api/jobs/my-jobs')
      setJobs(response.data)
    } catch (err) {
      setMessage('Unable to load your jobs.')
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      await api.post('/api/jobs/create', {
        title,
        company,
        location,
        description
      })
      setTitle('')
      setCompany('')
      setLocation('')
      setDescription('')
      fetchEmployerJobs()
      setMessage('Job created successfully.')
    } catch (err) {
      setMessage('Unable to create job. Please try again.')
    }
  }

  return (
    <div className="page-card">
      <h1>Employer dashboard</h1>
      <form onSubmit={handleCreate} className="form-card">
        <label>
          Job title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Company
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create job</button>
      </form>
      {message && (
  <div className={message.includes('success') ? 'form-success' : 'form-error'}>
    {message}
  </div>
)}
      <div className="section-header">
        <h2>Your posted jobs</h2>
      </div>
      <div className="grid-list">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.location}</p>
            <p>{job.company}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
