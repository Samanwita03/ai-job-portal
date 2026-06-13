import { useEffect, useState } from 'react'
import api from '../services/api'

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications/my-applications')
      setApplications(response.data)
    } catch (err) {
      setError('Unable to load applications.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return '#16a34a'
    if (score >= 50) return '#ca8a04'
    return '#dc2626'
  }

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Strong Match'
    if (score >= 50) return 'Good Match'
    return 'Low Match'
  }

  if (loading) return <div className="page-card">Loading your applications...</div>

  return (
    <div className="page-card">
      <h1>My Applications</h1>
      {error && <div className="form-error">{error}</div>}
      {applications.length === 0 && !error && (
        <p>You haven't applied to any jobs yet.</p>
      )}
      <div className="grid-list">
        {applications.map((app) => (
          <article key={app.id} className="job-card">
            <h2>{app.jobTitle}</h2>
            <p>{app.jobCompany}</p>

            {/* AI Match Score */}
            <div className="ai-match-box">
              <div className="ai-match-header">
                <span>AI Match Score</span>
                <span
                  className="score-badge"
                  style={{ color: getScoreColor(app.aiMatchScore) }}
                >
                  {app.aiMatchScore}% — {getScoreLabel(app.aiMatchScore)}
                </span>
              </div>

              {app.aiSummary && (
                <p className="ai-summary">{app.aiSummary}</p>
              )}

              {app.aiSkillGaps && app.aiSkillGaps !== '[]' && (
                <div className="skill-gaps">
                  <strong>Skills to improve:</strong>
                  <p>{app.aiSkillGaps}</p>
                </div>
              )}
            </div>

            <div className="app-status">
              Status: <span className={`status-${app.status?.toLowerCase()}`}>
                {app.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}