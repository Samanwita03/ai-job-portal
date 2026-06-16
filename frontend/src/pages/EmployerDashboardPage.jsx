import { useEffect, useState } from 'react'
import api from '../services/api'

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [skillsRequired, setSkillsRequired] = useState('')
  const [jobType, setJobType] = useState('FULL_TIME')
  const [salaryRange, setSalaryRange] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

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
    setLoading(true)
    try {
      await api.post('/api/jobs/create', {
        title, company, location, description,
        skillsRequired, jobType, salaryRange
      })
      setTitle('')
      setCompany('')
      setLocation('')
      setDescription('')
      setSkillsRequired('')
      setSalaryRange('')
      fetchEmployerJobs()
      setMessage('Job posted successfully!')
    } catch (err) {
      setMessage('Unable to create job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
  try {
    await api.delete(`/api/jobs/${jobId}`)
    // Remove from local state immediately
    setJobs(prev => prev.filter(job => job.id !== jobId))
    if (selectedJob?.id === jobId) {
      setSelectedJob(null)
      setApplicants([])
    }
    setMessage('Job removed successfully.')
  } catch (err) {
    setMessage('Unable to remove job.')
  }
}

  const handleViewApplicants = async (job) => {
    setSelectedJob(job)
    setLoadingApplicants(true)
    try {
      const response = await api.get(`/api/applications/job/${job.id}/applicants`)
      setApplicants(response.data)
    } catch (err) {
      setApplicants([])
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId)
    try {
      await api.put(`/api/applications/${applicationId}/status`, {
        status: newStatus
      })
      setApplicants(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ))
    } catch (err) {
      setMessage('Failed to update status.')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return '#22d3a5'
    if (score >= 50) return '#ffd32a'
    return '#ff4757'
  }

  return (
    <div className="page-card">
      <h1>Employer Dashboard</h1>

      {/* Post Job Form */}
      <div className="dashboard-section">
        <h2 className="section-title">Post a New Job</h2>
        <form onSubmit={handleCreate} className="form-card">
          <div className="form-row">
            <label>
              Job Title
              <input type="text" value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Java Developer" required />
            </label>
            <label>
              Company
              <input type="text" value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp India" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Location
              <input type="text" value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Remote" required />
            </label>
            <label>
              Salary Range
              <input type="text" value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. 8-12 LPA" />
            </label>
          </div>
          <label>
            Job Type
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="REMOTE">Remote</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </label>
          <label>
            Required Skills (comma separated)
            <input type="text" value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="e.g. Java, Spring Boot, React, PostgreSQL, AWS" />
          </label>
          <label>
            Job Description
            <textarea rows={5} value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              required />
          </label>
          <button type="submit" disabled={loading}>
            {loading && <span className="loader"></span>}
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
        {message && (
          <div className={message.includes('success') || message.includes('removed')
            ? 'form-success' : 'form-error'}>
            {message}
          </div>
        )}
      </div>

      {/* Posted Jobs */}
      <div className="dashboard-section">
        <h2 className="section-title">Your Posted Jobs</h2>
        {jobs.length === 0 && (
          <p style={{color: 'var(--text-muted)'}}>No jobs posted yet.</p>
        )}
        <div className="jobs-table">
          {jobs.map((job) => (
            <div key={job.id} className={`job-row ${selectedJob?.id === job.id ? 'selected' : ''}`}>
              <div className="job-row-info">
                <span className="job-row-title">{job.title}</span>
                <span className="job-row-meta">{job.company} • {job.location}</span>
                {job.jobType && (
                  <span className="job-type-badge">{job.jobType.replace('_', ' ')}</span>
                )}
              </div>
              <div className="job-row-actions">
                <button
                  className="btn-outline"
                  onClick={() => handleViewApplicants(job)}>
                  View Applicants
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteJob(job.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applicants Panel */}
      {selectedJob && (
        <div className="dashboard-section">
          <h2 className="section-title">
            Applicants for: <span style={{color: 'var(--accent-primary)'}}>{selectedJob.title}</span>
          </h2>
          {loadingApplicants && (
            <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
              <span className="loader"></span> Loading applicants...
            </div>
          )}
          {!loadingApplicants && applicants.length === 0 && (
            <p style={{color: 'var(--text-muted)'}}>No applicants yet for this job.</p>
          )}
          {!loadingApplicants && applicants.map((app) => (
            <div key={app.id} className="applicant-card">
              <div className="applicant-header">
                <div>
                  <div className="applicant-name">Applicant #{app.id}</div>
                  <div className="applicant-date">
                    Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div className="applicant-score"
                  style={{color: getScoreColor(app.aiMatchScore)}}>
                  {app.aiMatchScore}% Match
                </div>
              </div>

              {/* AI Analysis */}
              <div className="ai-match-box">
                <div className="ai-match-header">
                  <span>AI Resume Analysis</span>
                  <span className="score-badge"
                    style={{color: getScoreColor(app.aiMatchScore)}}>
                    {app.aiMatchScore}%
                  </span>
                </div>
                {app.aiSummary && (
                  <p className="ai-summary">{app.aiSummary}</p>
                )}
                {app.aiSkillGaps && app.aiSkillGaps !== '[]' && (
                  <div className="skill-gaps">
                    <strong>Missing Skills:</strong> {app.aiSkillGaps}
                  </div>
                )}
              </div>

              {/* Status Controls */}
              <div className="status-controls">
                <span className="status-label">Status:</span>
                <span className={`status-${app.status?.toLowerCase()}`}>
                  {app.status}
                </span>
                <div className="status-buttons">
  {app.status !== 'SHORTLISTED' && app.status !== 'REJECTED' && (
    <button
      className="btn-success"
      disabled={updatingStatus === app.id}
      onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}>
      {updatingStatus === app.id
        ? <span className="loader"></span>
        : '✓'} Shortlist
    </button>
  )}
  {app.status === 'PENDING' && (
    <button
      className="btn-warning"
      disabled={updatingStatus === app.id}
      onClick={() => handleStatusChange(app.id, 'REVIEWED')}>
      👁 Mark Reviewed
    </button>
  )}
  {app.status !== 'REJECTED' && (
    <button
      className="btn-danger"
      disabled={updatingStatus === app.id}
      onClick={() => handleStatusChange(app.id, 'REJECTED')}>
      ✕ Reject
    </button>
  )}
  {(app.status === 'SHORTLISTED' || app.status === 'REJECTED') && (
    <span style={{
      fontSize: '0.8rem',
      color: app.status === 'SHORTLISTED'
        ? 'var(--accent-green)'
        : 'var(--accent-red)',
      fontStyle: 'italic'
    }}>
      {app.status === 'SHORTLISTED'
        ? '✓ Shortlisted — no further action needed'
        : '✕ Rejected — decision final'}
    </span>
  )}
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}