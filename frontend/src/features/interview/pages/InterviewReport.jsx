import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { useInterview } from '../hooks/useInterview'
import '../interview.scss'

const severityConfig = {
  high  : { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  color: '#dc2626' },
  medium: { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)',  color: '#b45309' },
  low   : { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  color: '#15803d' },
}

function ScoreRing({ score = 0, size = 90, strokeW = 4 }) {
  const r      = (size - strokeW) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="position-relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth={strokeW} />
        <circle
          className="score-ring-circle"
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="url(#ringGrad)"
          strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ}
          style={{ '--ring-offset': offset }}
        />
      </svg>
      <div className="score-number position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <span className="fw-semibold lh-1 me-1" style={{ fontSize: '1.2rem', color: '#111827' }}>{score}</span>
        <small className='fw-semibold' style={{ fontSize: '1.1rem' }}>%</small>
      </div>
    </div>
  )
}

const getScoreLabel = (score) => {
  if (score >= 80) return { text: 'Strong match for this role', color: '#16a34a' }
  if (score >= 60) return { text: 'Good match — some gaps to address', color: '#b45309' }
  return { text: 'Needs improvement before applying', color: '#dc2626' }
}

const InterviewReport = () => {
  const { id } = useParams()
  const { loading , report , handleSingleReport , handleGenerateResumePdf } = useInterview();

  useEffect(() => {
      if (id) {
          handleSingleReport(id)
      }
  }, [id])

  const [activeTab, setActiveTab] = useState('technical')
  const [openQ, setOpenQ]         = useState(null)

  const reportData = report?.interviewReport || null

  const navItems = [
    { id: 'technical',  icon: 'bi-code-slash',         label: 'Technical Questions'  },
    { id: 'behavioral', icon: 'bi-chat-left-text-fill', label: 'Behavioral Questions' },
    { id: 'roadmap',    icon: 'bi-map-fill',            label: 'Road Map'             },
    { id: 'matchscore', icon: 'bi-bullseye',            label: 'Match Score'          },
    { id: 'skillgaps',  icon: 'bi-bar-chart-fill',      label: 'Skill Gaps'           },
  ]

  const sidebarNavItems = navItems.filter(
    item => !['matchscore', 'skillgaps'].includes(item.id)
  )

  const lgOnlyNavItems = navItems.filter(
    item => ['matchscore', 'skillgaps'].includes(item.id)
  )

  const renderQuestions = (questions = [], accentColor = 'rgba(99,102,241,', badgeColor = '#6366f1') => (
    questions.map((q, i) => (
      <div
        key={i}
        className="rounded-3 mb-3 overflow-hidden"
        style={{
          background: `#ffffff`,
          border    : openQ === i
            ? `1px solid ${accentColor}0.35)`
            : `1px solid rgba(0,0,0,0.1)`,
          boxShadow : openQ === i ? `0 0 0 3px ${accentColor}0.08)` : 'none',
        }}
      >
        <div
          className="d-flex align-items-center gap-3 px-3 py-3"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenQ(openQ === i ? null : i)}
        >
          <span
            className="rounded-2 px-2 py-1 fw-semibold flex-shrink-0"
            style={{ background: `${accentColor}0.1)`, color: badgeColor, fontSize: '0.68rem' }}
          >
            Q{i + 1}
          </span>
          <span className="flex-grow-1 fw-medium" style={{ color: '#111827', fontSize: '0.875rem', lineHeight: 1.5 }}>
            {q.question}
          </span>
          <i
            className={`bi bi-chevron-down q-chevron flex-shrink-0 ${openQ === i ? 'open' : ''}`}
            style={{ color: openQ === i ? badgeColor : '#9ca3af', fontSize: 13 }}
          />
        </div>

        {openQ === i && (
          <div className="q-body" style={{ borderTop: `1px solid rgba(0,0,0,0.07)` }}>
            <div className="px-4 pt-3 pb-2">
              <span
                className="d-inline-block rounded-2 px-2 py-1 mb-2 fw-semibold"
                style={{
                  background   : `${accentColor}0.1)`,
                  border       : `1px solid ${accentColor}0.25)`,
                  color        : badgeColor,
                  fontSize     : '0.65rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Intention
              </span>
              <p className="mb-0" style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.7 }}>
                {q.intention}
              </p>
            </div>

            <div
              className="px-3 pt-2 pb-3 mx-4 mb-3 rounded-3"
              style={{
                background : '#f9fafb',
                border     : '1px solid rgba(0,0,0,0.07)',
                marginTop  : 4,
              }}
            >
              <span
                className="d-inline-block rounded-2 px-2 py-1 mb-2 fw-semibold"
                style={{
                  background   : 'rgba(99,102,241,0.08)',
                  border       : '1px solid rgba(99,102,241,0.2)',
                  color        : '#6366f1',
                  fontSize     : '0.65rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop    : 8,
                }}
              >
                Model Answer
              </span>
              <p className="mb-0" style={{ color: '#374151', fontSize: '0.825rem', lineHeight: 1.75 }}>
                {q.answer}
              </p>
            </div>
          </div>
        )}
      </div>
    ))
  )

  return (
    <div className="overflow-x-hidden position-relative">

      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="grid-overlay"></div>

      <div className="container interview-section">
        <Navbar />

        {/* ── Hero ── */}
        <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center">
          <div className="badge-pill d-flex align-items-center rounded-pill py-2 px-4 mb-4" style={{ marginTop: '35px' }}>
            <i className="bi bi-stars me-2"></i>
            <span>Interview Strategy Ready</span>
          </div>

          <div className="col-12 col-lg-8 mb-5">
            <h1 className="interview-title fw-bold mb-3 hero-fade">
              Your{' '}
              <span className="interview-highlight">
                <span className="highlight-word">Interview Report</span>
                <svg className="underline-svg" viewBox="0 0 300 18" preserveAspectRatio="none">
                  <path d="M0,14 Q75,2 150,10 Q225,18 300,6" stroke="url(#grad2)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="hero-sub text-body-secondary mx-auto hero-fade delay-1">
              AI-generated questions, skill gaps &amp; a personalised prep roadmap
            </p>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 mb-5">
            <div className="spinner-border mb-3" style={{ color: '#6366f1' }} role="status" aria-hidden="true"></div>
            <p className="text-body-secondary mb-0" style={{ fontSize: '0.875rem' }}>Loading your report...</p>
          </div>
        )}

        {/* ── Error / Not Found State ── */}
        {!loading && !reportData && (
          <div className="text-center py-5 mb-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)' }}
            >
              <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 28, color: '#ef4444' }}></i>
            </div>
            <p className="fw-semibold mb-1" style={{ color: '#111827' }}>Report not found</p>
            <p className="text-body-secondary mb-0" style={{ fontSize: '0.85rem' }}>
              This report may have been deleted or the link is invalid.
            </p>
          </div>
        )}

        {/* ── Report Card — only when data is loaded ── */}
        {!loading && reportData && (
          <div className="report-card-enter rounded-2 overflow-hidden d-flex mb-5"
            style={{
              background : '#ffffff82',
              border     : '1.5px solid rgba(99,102,241,0.18)',
              minHeight  : 520,
            }}>

            {/* ── Left Sidebar — xl only ── */}
            <div className="d-none d-xl-flex flex-column flex-shrink-0 justify-content-between p-3"
              style={{ width: 250, borderRight: '1.5px solid rgba(0,0,0,0.08)' }}>
              <div>
                <p className="text-uppercase fw-medium mt-1" style={{ fontSize: '12px' , marginBottom : '15px' }}>Sections</p>
                {sidebarNavItems.map(item => {
                  const active = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      className="ir-nav-item d-flex align-items-center gap-2 rounded-3 px-2 py-2 mb-1 border-0 w-100   text-start"
                      onClick={() => { setActiveTab(item.id); setOpenQ(null) }}
                      style={{
                        background : active ? 'rgba(99,102,241,0.1)' : 'transparent',
                        color      : active ? '#6366f1' : '#6b7280',
                        border     : active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                        fontSize   : '0.845rem',
                        fontWeight : 500,
                        cursor     : 'pointer',
                      }}
                    >
                      <span
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{
                          width      : 28, height: 28,
                          background : active ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.06)',
                          fontSize   : 13,
                          color      : active ? '#6366f1' : '#9ca3af',
                        }}
                      >
                        <i className={`bi ${item.icon}`} />
                      </span>
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <button onClick={()=> { handleGenerateResumePdf(report?.interviewReport?._id) }} className='btn btn-outline-primary rounded-2 py-2' style={{ fontSize : '15px' }}>Download Resume</button>
            </div>

            {/* ── Main Panel ── */}
            <div className="flex-grow-1 p-4" style={{ minWidth: 0 }}>

              {/* Mobile tabs — all 5, below lg */}
              <div className="d-flex d-xl-none gap-2 mb-4 flex-wrap">
                {navItems.map(item => {
                  const active = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      className="btn btn-sm rounded-pill px-3"
                      onClick={() => { setActiveTab(item.id); setOpenQ(null) }}
                      style={{
                        background : active ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.04)',
                        border     : active ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(99,102,241,0.12)',
                        color      : active ? '#6366f1' : '#6b7280',
                        fontSize   : '0.78rem',
                      }}
                    >
                      <i className={`bi ${item.icon} me-1`} />
                      {item.label}
                    </button>
                  )
                })}
              <button onClick={()=> { handleGenerateResumePdf(report?.interviewReport?._id) }} className='btn btn-sm btn-outline-primary rounded-1' style={{ fontSize : '0.78rem' }}>Download Resume</button>
              </div>

              {/* ── Technical Questions ── */}
              {activeTab === 'technical' && (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#111827' }}>Technical Questions</h5>
                    <span
                      className="rounded-pill px-3 py-1"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      {reportData.technicalQuestions?.length || 0} questions
                    </span>
                  </div>
                  {reportData.technicalQuestions?.length > 0
                    ? renderQuestions(reportData.technicalQuestions, 'rgba(99,102,241,', '#6366f1')
                    : <p className="text-body-secondary" style={{ fontSize: '0.875rem' }}>No technical questions found.</p>
                  }
                </>
              )}

              {/* ── Behavioral Questions ── */}
              {activeTab === 'behavioral' && (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#111827' }}>Behavioral Questions</h5>
                    <span
                      className="rounded-pill px-3 py-1"
                      style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#b45309', fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      {reportData.behavioralQuestions?.length || 0} questions
                    </span>
                  </div>
                  {reportData.behavioralQuestions?.length > 0
                    ? renderQuestions(reportData.behavioralQuestions, 'rgba(234,179,8,', '#b45309')
                    : <p className="text-body-secondary" style={{ fontSize: '0.875rem' }}>No behavioral questions found.</p>
                  }
                </>
              )}

              {/* ── Road Map ── */}
              {activeTab === 'roadmap' && (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#111827' }}>Preparation Road Map</h5>
                    <span
                      className="rounded-pill px-3 py-1"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      {reportData.preparationPlan?.length || 0}-day Plan
                    </span>
                  </div>

                  {reportData.preparationPlan?.length > 0 ? (
                    reportData.preparationPlan.map((phase, i) => (
                      <div key={i} className="d-flex gap-3">
                        <div className="d-flex flex-column align-items-center flex-shrink-0" style={{ width: 20 }}>
                          <div
                            className="flex-shrink-0 rounded-circle"
                            style={{
                              width      : 22, height: 22,
                              background : 'transparent',
                              border     : '2.5px solid #6366f1',
                              zIndex     : 1,
                            }}
                          />
                          {i < reportData.preparationPlan.length - 1 && (
                            <div
                              className="flex-grow-1"
                              style={{ width: 2, background: '#6366f1', minHeight: 40 }}
                            />
                          )}
                        </div>

                        <div className="pb-2">
                          <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
                            <span
                              className="d-inline-block rounded-1 px-2 py-1 mb-1 fw-semibold"
                              style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', fontSize: '0.68rem' }}
                            >
                              Day {phase.day}
                            </span>
                            <p className="fw-semibold mb-1" style={{ color: '#111827', fontSize: '0.88rem' }}>{phase.focus}</p>
                          </div>
                          <ul className="list-unstyled mb-3">
                            {phase.tasks.map((task, j) => (
                              <li key={j} className="d-flex align-items-center gap-2 mb-1" style={{ color: '#4b5563', fontSize: '0.8rem', lineHeight: 1.55 }}>
                                <span className='rounded-pill' style={{ width: '5px', height: '5px', backgroundColor: '#6366f1', flexShrink: 0 }}></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-body-secondary" style={{ fontSize: '0.875rem' }}>No preparation plan found.</p>
                  )}
                </>
              )}

              {/* ── Match Score — lg only (not xl) ── */}
              {activeTab === 'matchscore' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#111827' }}>Match Score</h5>
                    <span
                      className="rounded-pill px-3 py-1"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      AI Evaluated
                    </span>
                  </div>
                  <div className="d-flex flex-column align-items-center py-4">
                    <ScoreRing score={reportData.matchScore} size={140} strokeW={6} />
                    <p className="mt-3 mb-0 text-center" style={{ fontSize: '0.9rem', color: getScoreLabel(reportData.matchScore).color, fontWeight: 500 }}>
                      {getScoreLabel(reportData.matchScore).text}
                    </p>
                    <p className="mt-2 text-center text-body-secondary" style={{ fontSize: '0.8rem', maxWidth: 320 }}>
                      Your profile aligns with the job requirements. Focus on the skill gaps to maximise your chances.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Skill Gaps — lg only (not xl) ── */}
              {activeTab === 'skillgaps' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#111827' }}>Skill Gaps</h5>
                    <span
                      className="rounded-pill px-3 py-1"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      {reportData.skillGaps?.length || 0} identified
                    </span>
                  </div>
                  {reportData.skillGaps?.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {reportData.skillGaps.map((sg, i) => {
                        const cfg = severityConfig[sg.severity]
                        return (
                          <div
                            key={i}
                            className="d-flex align-items-center justify-content-between rounded-2 px-3 py-3"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                          >
                            <span style={{ color: '#111827', fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>
                              {sg.skill}
                            </span>
                            <span
                              className="ms-3 flex-shrink-0 fw-medium rounded-pill px-2 py-1"
                              style={{ background: cfg.bg, color: cfg.color, fontSize: '0.65rem', border: `1px solid ${cfg.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              {sg.severity}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-body-secondary" style={{ fontSize: '0.875rem' }}>No skill gaps identified.</p>
                  )}
                </div>
              )}

            </div>

            {/* ── Right Panel — xl only ── */}
            <div className="d-none d-xl-flex flex-column flex-shrink-0 p-3"
              style={{ width: 250, borderLeft: '1.5px solid rgba(0,0,0,0.08)', gap: 24 }}
            >
              {/* Match Score */}
              <div>
                <span className="text-uppercase fw-medium" style={{ fontSize: '12px' }}>Match Score</span>
                <div className="d-flex flex-column align-items-center mt-4">
                  <ScoreRing score={reportData.matchScore} />
                  <p className="mt-2 mb-0 text-center" style={{ fontSize: '0.72rem', color: getScoreLabel(reportData.matchScore).color, fontWeight: 500 }}>
                    {getScoreLabel(reportData.matchScore).text}
                  </p>
                </div>
              </div>

              <hr className='m-0 text-body-secondary' />

              {/* Skill Gaps */}
              <div>
                <p className="text-uppercase fw-medium mb-3" style={{ fontSize: '12px' }}>Skill Gaps</p>
                {reportData.skillGaps?.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {reportData.skillGaps.map((sg, i) => {
                      const cfg = severityConfig[sg.severity]
                      return (
                        <div
                          key={i}
                          className="skill-tag d-flex align-items-center justify-content-between rounded-2 px-2 py-2"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          <span style={{ color: '#111827', fontSize: '0.72rem', fontWeight: 500, lineHeight: 1.4 }}>
                            {sg.skill}
                          </span>
                          <span
                            className="ms-2 flex-shrink-0 fw-medium rounded-pill px-2"
                            style={{ background: cfg.bg, color: cfg.color, fontSize: '0.6rem', border: `1px solid ${cfg.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          >
                            {sg.severity}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-body-secondary mb-0" style={{ fontSize: '0.75rem' }}>No skill gaps identified.</p>
                )}
              </div>
            </div>

          </div>
        )}
        {/* end report card */}

        <Footer />
      </div>
    </div>
  )
}

export default InterviewReport