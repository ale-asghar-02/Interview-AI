import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview';

import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import '../interview.scss';

const GenerateInterviewReport = () => {

  const { loading, handleGenerateReport, report } = useInterview();
  const navigate = useNavigate();

  const [jobDesc,      setJobDesc]      = useState('')
  const [selfDesc,     setSelfDesc]     = useState('')
  const [resumeFile,   setResumeFile]   = useState(null)
  const [dragOver,     setDragOver]     = useState(false)
  const [resumeError,  setResumeError]  = useState('')
  const [formError,    setFormError]    = useState('')
  const fileInputRef                    = useRef(null)

  /* ── Constants ──────────────────────────────────────────────── */
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const ALLOWED_EXTS = ['.pdf', '.docx']
  const MAX_MB  = 5
  const JOB_MAX  = 5000
  const SELF_MAX = 1000

  /* ── File Validation ────────────────────────────────────────── */
  const validateFile = (file) => {
    if (file.type.startsWith('image/')) {
      setResumeError('Image files are not allowed. Please upload a PDF or DOCX resume.')
      return false
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setResumeError('Only PDF or DOCX files are allowed. No images or other file types.')
      return false
    }
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      setResumeError('Only .pdf or .docx files are accepted.')
      return false
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setResumeError(`File size must be under ${MAX_MB}MB.`)
      return false
    }
    return true
  }

  /* ── File Handlers ──────────────────────────────────────────── */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setResumeError('')
    setFormError('')  // ✅ Fix 2: clear form error when file selected
    if (validateFile(file)) setResumeFile(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    setResumeError('')
    setFormError('')  // ✅ Fix 2: clear form error on drop
    if (validateFile(file)) setResumeFile(file)
  }

  const removeFile = () => {
    setResumeFile(null)
    setResumeError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* ── Submit ─────────────────────────────────────────────────── */
  const handleSubmitGenerateReport = async (e) => {
    e.preventDefault()

    if (!resumeFile) {
      setFormError('Please upload your Resume (PDF or DOCX) to continue.')
      return
    }
    if (!jobDesc.trim() && !selfDesc.trim()) {
      setFormError('Please enter a Job Description or a Self Description — at least one is required.')
      return
    }

    setFormError('')

    try {
      const data = await handleGenerateReport({
        jobDescription:  jobDesc,
        selfDescription: selfDesc,
        resumeFile:      resumeFile,
      })

      if (data) {
        // ✅ Fix 1: navigate to single report page after generation
        navigate(`/interview/report/${data.interviewReport._id}`)
      }
    } catch (error) {
      setFormError('An error occurred while generating the report. Please try again.')
    }
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className='overflow-x-hidden position-relative'>

      {/* Background Effects */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="grid-overlay"></div>

      <div className="container interview-section">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center">

          <div className='badge-pill d-flex align-items-center rounded-pill py-2 px-4 mb-4' style={{ marginTop: '35px' }}>
            <i className="bi bi-stars me-2"></i>
            <span>AI-Powered Strategy</span>
          </div>

          <div className='col-12 col-lg-10 mb-5'>
            <h1 className="interview-title fw-bold mb-4">
              Create Your Custom{' '}
              <span className="interview-highlight">
                <span className="highlight-word">Interview Plan</span>
                <svg className="underline-svg" viewBox="0 0 300 18" preserveAspectRatio="none">
                  <path d="M0,14 Q75,2 150,10 Q225,18 300,6" stroke="url(#grad)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
            </h1>
            <p className='col hero-sub text-body-secondary mx-auto'>
              Let our AI analyze the job requirements and your unique profile to build a winning strategy.
            </p>
          </div>

        </div>

        {/* ── FORM ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmitGenerateReport}>

          {/* ── FORM ROW ───────────────────────────────────────── */}
          <div className="row g-4 mb-4 interview-form-section">

            {/* ── LEFT: Job Description ────────────────────────── */}
            <div className="col-12 col-lg-6">
              <div className="h-100 rounded-4 p-4 d-flex flex-column"
                style={{
                  border: '1.5px solid rgba(99,102,241,0.18)',
                  background: '#fafaff',
                }}>

                {/* Card Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.1)', flexShrink: 0 }}>
                      <i className="bi bi-briefcase-fill" style={{ color: '#6366f1', fontSize: 15 }}></i>
                    </div>
                    <span className="fw-semibold" style={{ color: '#0f0f1a', fontSize: '0.95rem' }}>
                      Target Job Description
                    </span>
                  </div>
                  <span className="badge rounded-pill"
                    style={{
                      background: 'rgba(234,179,8,0.08)',
                      color: '#ca8a04',
                      border: '1px solid rgba(234,179,8,0.25)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}>
                    One Required
                  </span>
                </div>

                {/* Textarea */}
                <textarea
                  className="form-control border-0 bg-transparent flex-grow-1"
                  maxLength={JOB_MAX}
                  value={jobDesc}
                  onChange={(e) => { setJobDesc(e.target.value); setFormError('') }}
                  placeholder={`Paste the full job description here…\n\nE.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design…"`}
                  style={{
                    resize: 'none',
                    color: '#0f0f1a',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    outline: 'none',
                    boxShadow: 'none',
                    padding: 0,
                    minHeight: '260px',
                  }}
                />

                {/* Character Counter */}
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2"
                  style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    <i className="bi bi-type me-1"></i>Job description text
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: jobDesc.length > JOB_MAX * 0.9 ? '#f59e0b' : '#94a3b8',
                    fontWeight: 400,
                  }}>
                    {jobDesc.length} / {JOB_MAX}
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Profile ───────────────────────────────── */}
            <div className="col-12 col-lg-6 d-flex flex-column gap-4">

              {/* Resume Upload */}
              <div className="rounded-4 p-4"
                style={{
                  border: resumeError
                    ? '1.5px solid rgba(239,68,68,0.4)'
                    : '1.5px solid rgba(99,102,241,0.18)',
                  background: '#fafaff',
                }}>

                {/* Section Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.1)', flexShrink: 0 }}>
                      <i className="bi bi-person-vcard-fill" style={{ color: '#6366f1', fontSize: 15 }}></i>
                    </div>
                    <span className="fw-semibold" style={{ color: '#0f0f1a', fontSize: '0.95rem' }}>
                      Upload Resume
                    </span>
                  </div>
                  <span className="badge rounded-pill"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.2)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}>
                    Required
                  </span>
                </div>

                {/* Drop Zone */}
                {!resumeFile ? (
                  <div
                    className="rounded-3 d-flex flex-column align-items-center justify-content-center"
                    style={{
                      border: dragOver
                        ? '2px dashed #6366f1'
                        : resumeError
                        ? '2px dashed rgba(239,68,68,0.45)'
                        : '2px dashed rgba(99,102,241,0.3)',
                      background: dragOver ? 'rgba(99,102,241,0.04)' : 'transparent',
                      padding: '2rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{ width: 52, height: 52, background: 'rgba(99,102,241,0.08)' }}>
                      <i className="bi bi-cloud-upload-fill" style={{ color: '#6366f1', fontSize: 22 }}></i>
                    </div>
                    <p className="mb-1 fw-semibold" style={{ color: '#0f0f1a', fontSize: '0.875rem' }}>
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="mb-1" style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      PDF or DOCX only — Max 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="rounded-3 d-flex align-items-center justify-content-between px-3 py-2"
                    style={{
                      border: '1.5px solid rgba(99,102,241,0.25)',
                      background: 'rgba(99,102,241,0.04)',
                    }}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-file-earmark-check-fill" style={{ color: '#6366f1', fontSize: 20 }}></i>
                      <div>
                        <p className="mb-0 fw-semibold" style={{ fontSize: '0.8rem', color: '#0f0f1a' }}>
                          {resumeFile.name}
                        </p>
                        <p className="mb-0" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    {/* ✅ Fix: type="button" added to prevent form submit */}
                    <button
                      type="button"
                      className="btn btn-sm p-0 border-0 bg-transparent"
                      onClick={removeFile}
                      title="Remove file"
                      style={{ color: '#ef4444', fontSize: 18, lineHeight: 1 }}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  </div>
                )}

                {resumeError && (
                  <p className="mb-0 mt-2" style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                    <i className="bi bi-exclamation-circle-fill me-1"></i>{resumeError}
                  </p>
                )}
              </div>

              <p className="mb-0" style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500 }}>
                Note: Resume must be text-based (PDF or DOCX). Image-based files are not accepted.
              </p>

              {/* Self Description */}
              <div className="rounded-4 p-4 flex-grow-1"
                style={{
                  border: '1.5px solid rgba(234,179,8,0.2)',
                  background: '#fafaff',
                }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <p className="mb-0 fw-semibold" style={{ color: '#0f0f1a', fontSize: '0.875rem' }}>
                    Quick Self-Description
                  </p>
                  <span className="badge rounded-pill"
                    style={{
                      background: 'rgba(234,179,8,0.08)',
                      color: '#ca8a04',
                      border: '1px solid rgba(234,179,8,0.25)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}>
                    One Required
                  </span>
                </div>

                <p className="mb-2" style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Fill this <strong style={{ color: '#64748b' }}>or</strong> the Job Description on the left — at least one is needed.
                </p>

                <textarea
                  className="form-control border-0 bg-transparent"
                  rows={5}
                  maxLength={SELF_MAX}
                  value={selfDesc}
                  onChange={(e) => { setSelfDesc(e.target.value); setFormError('') }}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a job description handy…"
                  style={{
                    resize: 'none',
                    color: '#0f0f1a',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    outline: 'none',
                    boxShadow: 'none',
                    padding: 0,
                  }}
                />

                <div className="d-flex align-items-center justify-content-between mt-2 pt-2"
                  style={{ borderTop: '1px solid rgba(234,179,8,0.12)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    <i className="bi bi-type me-1"></i>Self description text
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: selfDesc.length > SELF_MAX * 0.9 ? '#f59e0b' : '#94a3b8',
                    fontWeight: 400,
                  }}>
                    {selfDesc.length} / {SELF_MAX}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ── VALIDATION ERROR ──────────────────────────────── */}
          {formError && (
            <div className="rounded-3 d-flex align-items-center gap-2 px-4 py-3 mb-4 interview-validation"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }}></i>
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{formError}</span>
            </div>
          )}

          {/* ── INFO NOTE ─────────────────────────────────────── */}
          <div className="rounded-3 d-flex flex-wrap flex-md-nowrap align-items-center gap-2 px-4 py-3 mb-3 interview-info-node"
            style={{
              background: 'rgba(99,102,241,0.05)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}>
            <i className="bi bi-info-circle-fill mt-1" style={{ color: '#6366f1', fontSize: 15, flexShrink: 0 }}></i>
            <p className="small mb-0" style={{ color: '#64748b' }}>
              <span className='fw-medium' style={{ color: '#0f0f1a' }}>Resume</span> is always required (PDF or DOCX — no images).{' '}
              Additionally, enter a <span className='fw-medium' style={{ color: '#0f0f1a' }}>Job Description</span> or a{' '}
              <span className='fw-medium' style={{ color: '#0f0f1a' }}>Self Description</span> — at least one is needed to generate your personalized strategy.
            </p>
          </div>

          {/* ── FOOTER BAR ────────────────────────────────────── */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-3 px-4 py-3 mb-5 interview-footer-bar"
            style={{
              border: '1.5px solid rgba(99,102,241,0.15)',
              background: '#fafaff',
            }}>
            <div className="d-flex flex-wrap gap-3">
              {[
                { icon: 'bi-bar-chart-fill',       label: 'AI Powered Strategy' },
                { icon: 'bi-lightning-charge-fill', label: 'Instant Results'     },
                { icon: 'bi-shield-check',          label: 'Approx 90s'          },
              ].map((item, i) => (
                <span key={i} className="d-flex align-items-center gap-1"
                  style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  <i className={`bi ${item.icon}`} style={{ color: '#6366f1', fontSize: 13 }}></i>
                  {item.label}
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="btn-interview d-flex align-items-center gap-2 px-4"
              disabled={loading}
            >
              <span className="bubble b1"></span>
              <span className="bubble b2"></span>
              <span className="bubble b3"></span>
              <span className="bubble b4"></span>
              <span className="bubble b5"></span>
              <span className="bubble b6"></span>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-stars"></i>
                  Generate My Interview Strategy
                </>
              )}
            </button>

          </div>

        </form>

        <Footer />
      </div>
    </div>
  )
}

export default GenerateInterviewReport