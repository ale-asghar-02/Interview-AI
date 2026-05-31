import React, { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../features/auth/hooks/useAuth'
import Loading from '../routes/Loading'

const sections = [
  {
    icon: 'bi-info-circle-fill',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    title: '1. Information We Collect',
    content: [
      'When you use our platform, we may temporarily process the following information solely to generate your interview report:',
      '• Resume content (text you paste or upload)',
      '• Self-description you provide',
      '• Job description you submit',
      'We do <strong>not</strong> collect your name, email, or any personally identifiable information unless you explicitly create an account.',
    ]
  },
  {
    icon: 'bi-gear-fill',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.1)',
    title: '2. How We Use Your Information',
    content: [
      'Your data is used exclusively for the following purpose:',
      '• To generate a personalized AI-powered interview prep report',
      '• To improve our AI model accuracy (only in anonymized, aggregated form)',
      'We do <strong>not</strong> sell, rent, or share your personal information with any third parties for marketing purposes.',
    ]
  },
  {
    icon: 'bi-shield-lock-fill',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    title: '3. Data Storage & Retention',
    content: [
      'We follow a <strong>Privacy First</strong> policy:',
      '• Resume and job description data is processed in-memory and discarded after your report is generated.',
      '• No session data is stored on our servers beyond the active request.',
      '• If you create an account, only your email and authentication credentials are stored — no resume data is ever saved to our database.',
    ]
  },
  {
    icon: 'bi-person-lock',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: '4. Cookies & Tracking',
    content: [
      'We use minimal, essential cookies only:',
      '• <strong>Session cookies</strong> — to keep you logged in during your visit.',
      '• <strong>Analytics cookies</strong> — anonymous usage stats (e.g., page views) via privacy-respecting tools.',
      'We do not use any third-party advertising or behavioral tracking cookies.',
    ]
  },
  {
    icon: 'bi-people-fill',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
    title: '5. Third-Party Services',
    content: [
      'We may use trusted third-party providers to operate our service:',
      '• <strong>AI API providers</strong> — to process your prompt and generate the report (data sent is not stored by them per their data processing agreements).',
      '• <strong>Hosting providers</strong> — for secure infrastructure.',
      'All third parties are bound by strict data processing agreements.',
    ]
  },
  {
    icon: 'bi-person-check-fill',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    title: '6. Your Rights',
    content: [
      'You have full control over your data:',
      '• Right to access — request a copy of any data we hold on you.',
      '• Right to deletion — request permanent deletion of your account and associated data.',
      '• Right to correction — update any inaccurate information.',
      'To exercise any of these rights, contact us at <strong>privacy@yourapp.com</strong>.',
    ]
  },
  {
    icon: 'bi-lock-fill',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    title: '7. Security',
    content: [
      'We take security seriously:',
      '• All data is transmitted over <strong>HTTPS / TLS encryption</strong>.',
      '• Our infrastructure follows industry-standard security practices.',
      '• We conduct regular security audits.',
      'However, no system is 100% secure. We encourage you to use strong passwords and to not share sensitive personal details beyond what is necessary.',
    ]
  },
  {
    icon: 'bi-calendar-check-fill',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.1)',
    title: '8. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. When we do:',
      '• The "Last Updated" date at the top of this page will be revised.',
      '• For significant changes, we will notify registered users via email.',
      'Continued use of the platform after changes constitutes acceptance of the updated policy.',
    ]
  },
]

const summaryItems = [
  { color: '#6366f1', text: 'We do <strong>not</strong> sell or share your personal data with anyone.' },
  { color: '#10b981', text: 'Your resume and job data is processed in-memory and <strong>never stored</strong> on our servers.' },
  { color: '#a855f7', text: 'No account is required — we collect <strong>zero PII</strong> by default.' },
  { color: '#f59e0b', text: 'Only <strong>essential cookies</strong> are used — no ad tracking, no behavioral profiling.' },
  { color: '#f43f5e', text: 'All third-party providers are bound by <strong>strict data agreements</strong>.' },
  { color: '#22c55e', text: 'You can request <strong>access, correction, or deletion</strong> of your data at any time.' },
]

const PrivacyPolicy = () => {
  const { loading } = useAuth();
  const cardRefs = useRef([])

  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('policy-card--visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [loading]) 

  if (loading) { return <Loading /> } 

  return (
    <div className='overflow-x-hidden position-relative'>
      {/* Background Effects */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="grid-overlay"></div>

      <div className='container position-relative privacy-section'>
        <Navbar />

        {/* ─── HERO ─── */}
        <div className="hero-section text-center py-5 mt-3 mb-4">
          <div className="policy-badge badge-pill d-inline-flex align-items-center rounded-pill py-2 px-4 mb-4">
            <i className="bi bi-shield-check me-2"></i>
            <span>Privacy Policy</span>
          </div>

          <div className="policy-shield d-inline-block mb-3">
            <i
              className="bi bi-shield-lock-fill"
              style={{
                fontSize: '3.5rem',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            ></i>
          </div>

          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            Your Privacy, <span className="text-gradient">Our Priority</span>
          </h1>
          <p className="text-body-secondary mx-auto col-lg-6" style={{ lineHeight: 1.8 }}>
            We believe your data belongs to you. Read how we handle your information with complete transparency.
          </p>
          <p className="text-body-secondary mt-2" style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-calendar3 me-1"></i> Last Updated: July 1, 2025
          </p>
        </div>

        {/* ─── SECTIONS GRID ─── */}
        <div className="row g-4 mb-5 card-section">
          {sections.map((sec, i) => (
            <div className="col-12 col-md-6 policy-card" key={i} ref={el => cardRefs.current[i] = el} >
              <div className="policy-section-card feature-card h-100 p-4 rounded-4">
                <div className="mb-3 rounded-3 d-flex align-items-center justify-content-center" style={{ background: sec.bg, width: 48, height: 48 }}>
                  <i className={`bi ${sec.icon}`} style={{ fontSize: '1.3rem', color: sec.color }}></i>
                </div>

                <h5 className="fw-semibold mb-3" style={{ fontSize: '1rem' }}>{sec.title}</h5>

                <div className="text-body-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>
                  {sec.content.map((line, j) => (
                    <p key={j} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                </div>

                <div className="card-line mt-3" style={{ background: sec.color }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── TL;DR SUMMARY ─── */}
        <div className="feature-card rounded-4 p-4 p-md-5 mb-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ background: 'rgba(99,102,241,0.12)', width: 52, height: 52, flexShrink: 0 }}
            >
              <i className="bi bi-list-check" style={{ fontSize: '1.4rem', color: '#6366f1' }}></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0">Privacy at a Glance</h4>
              <p className="text-body-secondary mb-0" style={{ fontSize: '0.875rem' }}>
                A quick summary of what matters most
              </p>
            </div>
          </div>

          <div className="policy-summary-box p-3 p-md-4">
            {summaryItems.map((item, i) => (
              <div className="policy-summary-item" key={i}>
                <div className="summary-dot" style={{ background: item.color }}></div>
                <p
                  className="mb-0 text-body-secondary"
                  style={{ fontSize: '0.9rem', lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>

          <p className="text-body-secondary mt-3 mb-0" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-info-circle me-1"></i>
            This summary is for convenience only. Please read the full sections above for complete details.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default PrivacyPolicy