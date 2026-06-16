import { useEffect, useState, useRef } from 'react'
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
  const [uploadMode, setUploadMode] = useState('paste')
  const [fileName, setFileName] = useState('')
  const [extracting, setExtracting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/${id}`)
      setJob(response.data)
      try {
        const appsResponse = await api.get('/api/applications/my-applications')
        const applied = appsResponse.data.some(
          app => app.jobTitle === response.data.title &&
                 app.jobCompany === response.data.company
        )
        setAlreadyApplied(applied)
      } catch (e) {}
    } catch (err) {
      setMessage('Unable to load job details.')
    }
  }

  const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  setFileName(file.name)

  if (file.type === 'application/pdf') {
    setExtracting(true)
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }

      if (fullText.trim().length < 50) {
        setMessage('PDF appears to be image-based. Please paste your resume text instead.')
        setUploadMode('paste')
      } else {
        setResumeText(fullText.trim())
        setMessage('Resume extracted! Review the text and click Apply.')
      }
    } catch (err) {
      console.error('PDF error:', err)
      setMessage('Could not read PDF. Please paste your resume text instead.')
      setUploadMode('paste')
    } finally {
      setExtracting(false)
    }
  } else if (file.type === 'text/plain') {
    const text = await file.text()
    setResumeText(text)
    setMessage('Resume loaded successfully!')
  } else {
    setMessage('Please upload a PDF or TXT file only.')
  }
}

  const handleApply = async (event) => {
    event.preventDefault()
    if (applying) return
    if (!resumeText.trim()) {
      setMessage('Please add your resume text first.')
      return
    }
    setApplying(true)
    setMessage('')
    try {
      await api.post(`/api/applications/apply/${id}`, { resumeText })
      setMessage('Application submitted! Analyzing with AI...')
      setTimeout(() => navigate('/my-applications'), 2000)
      setResumeText('')
    } catch (err) {
      if (err.response?.status === 500 || err.response?.status === 400) {
        setMessage('You have already applied to this job.')
      } else {
        setMessage('Application failed. Please try again.')
      }
    } finally {
      setApplying(false)
    }
  }

  if (!job) {
    return (
      <div className="page-card" style={{textAlign:'center',
        padding:'3rem', color:'var(--text-muted)'}}>
        <span className="loader"></span> Loading job details...
      </div>
    )
  }

  return (
    <div className="page-card">
      <h1>{job.title}</h1>
      <p className="job-company">{job.company} — {job.location}</p>

      {job.salaryRange && (
        <p style={{textAlign:'center', color:'var(--accent-green)',
          marginBottom:'0.5rem'}}>
          💰 {job.salaryRange}
        </p>
      )}

      {job.skillsRequired && (
        <div className="job-skills" style={{justifyContent:'center',
          marginBottom:'1.5rem'}}>
          {job.skillsRequired.split(',').map((skill, i) => (
            <span key={i} className="skill-tag">{skill.trim()}</span>
          ))}
        </div>
      )}

      <div className="job-info">
        <p>{job.description}</p>
      </div>

      {alreadyApplied ? (
        <div className="already-applied-box">
          <div className="already-applied-icon">✓</div>
          <h3>Already Applied</h3>
          <p>You have already applied to this position.</p>
          <button onClick={() => navigate('/my-applications')}
            style={{marginTop:'1rem'}}>
            View My Applications
          </button>
        </div>
      ) : (
        <div className="resume-section">
          <h3 className="resume-section-title">Submit Your Resume</h3>

          {/* Toggle */}
          <div className="upload-toggle">
            <button
              type="button"
              className={uploadMode === 'paste' ? 'toggle-active' : 'toggle-inactive'}
              onClick={() => setUploadMode('paste')}>
              ✏️ Paste Text
            </button>
            <button
              type="button"
              className={uploadMode === 'upload' ? 'toggle-active' : 'toggle-inactive'}
              onClick={() => setUploadMode('upload')}>
              📄 Upload PDF
            </button>
          </div>

          <form onSubmit={handleApply} className="form-card">
            {uploadMode === 'upload' ? (
              <div className="upload-area"
                onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  style={{display:'none'}}
                />
                {extracting ? (
                  <div style={{textAlign:'center'}}>
                    <span className="loader"></span>
                    <p style={{color:'var(--text-muted)', marginTop:'0.5rem'}}>
                      Extracting resume text...
                    </p>
                  </div>
                ) : fileName ? (
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:'2rem'}}>📄</div>
                    <p style={{color:'var(--accent-green)',
                      fontWeight:'600'}}>{fileName}</p>
                    <p style={{color:'var(--text-muted)',
                      fontSize:'0.8rem'}}>Click to change file</p>
                  </div>
                ) : (
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:'2.5rem'}}>⬆️</div>
                    <p style={{color:'var(--text-secondary)',
                      marginTop:'0.5rem'}}>
                      Click to upload your resume
                    </p>
                    <p style={{color:'var(--text-muted)',
                      fontSize:'0.8rem'}}>PDF or TXT files supported</p>
                  </div>
                )}
              </div>
            ) : null}

            {resumeText && (
              <label>
                {uploadMode === 'upload'
                  ? 'Extracted Resume Text (you can edit):'
                  : 'Paste your resume or profile summary:'}
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Your resume text will appear here..."
                />
              </label>
            )}

            {uploadMode === 'paste' && !resumeText && (
              <label>
                Paste your resume or profile summary:
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume here for AI analysis..."
                  required
                />
              </label>
            )}

            <button type="submit" disabled={applying || extracting
              || !resumeText.trim()}>
              {applying && <span className="loader"></span>}
              {applying ? 'Analyzing with AI...' : 'Apply & Match Resume'}
            </button>
          </form>
        </div>
      )}

      {message && (
        <div className={message.includes('submitted') ||
          message.includes('extracted') || message.includes('loaded')
          ? 'form-success' : 'form-error'}>
          {message}
        </div>
      )}
    </div>
  )
}