import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [message, setMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${id}`)
      setJob(response.data)

      // Check if already applied
      try {
        const appsResponse = await api.get('/api/applications/my-applications')

        const alreadyAppliedToThis = appsResponse.data.some(
          app =>
            app.jobTitle === response.data.title &&
            app.jobCompany === response.data.company
        )

        setAlreadyApplied(alreadyAppliedToThis)
      } catch (e) {
        // User not logged in or has no applications
      }
    } catch (err) {
      setMessage('Unable to load job details.')
    }
  }

  useEffect(() => {
    fetchJob()
  }, [id])

  const handleApply = async (event) => {
    event.preventDefault()

    if (applying || alreadyApplied) return

    setApplying(true)
    setMessage('')

    try {
      await api.post(`/api/applications/apply/${id}`, {
        resumeText
      })

      setAlreadyApplied(true)
      setMessage('Application submitted! Redirecting...')
      setResumeText('')

      setTimeout(() => {
        navigate('/my-applications')
      }, 1500)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        ''

      if (
        (err.response?.status === 500 &&
          msg.toString().includes('Already applied')) ||
        err.response?.status === 400
      ) {
        setAlreadyApplied(true)
        setMessage(
          'You have already applied to this job. Check My Applications.'
        )
      } else {
        setMessage('Application failed. Please try again.')
      }
    } finally {
      setApplying(false)
    }
  }

  if (!job) {
    return (
      <div className="page-card">
        Loading job details...
      </div>
    )
  }

  return (
    <div className="page-card">
      <h1>{job.title}</h1>

      <p className="job-company">
        {job.company} — {job.location}
      </p>

      <div className="job-info">
        <p>{job.description}</p>
      </div>

      {alreadyApplied ? (
        <div className="form-success">
          You have already applied to this job.
          <br />
          <button
            type="button"   className="already-applied-btn"
            onClick={() => navigate('/my-applications')}
          >
            View My Applications
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="form-card">
          <label>
            Paste your resume or profile summary
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={applying}>
            {applying
              ? 'Submitting...'
              : 'Apply & Match Resume'}
          </button>
        </form>
      )}

      {message && (
        <div
          className={
            message.includes('submitted') ||
            message.includes('already applied')
              ? 'form-success'
              : 'form-error'
          }
        >
          {message}
        </div>
      )}
    </div>
  )
}