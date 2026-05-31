import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router';
import Loading from '../routes/Loading';

const Home = () => {

  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) { return <Loading /> }

  return (
    <div className='overflow-x-hidden position-relative'>
      {/* Background Effects */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="grid-overlay"></div>


      <div className='container home-section position-relative'>        
        <Navbar />

        {/* ─── SECTION 1: HERO ─── */}
        <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center hero-section" style={{ minHeight: '88vh' }}>

          <div className='badge-pill d-flex align-items-center rounded-pill py-2 px-4 mb-4'>
            <i className="bi bi-clock me-2"></i>
            <span>AI-Powered Interview Reports</span>
          </div>

          <div className='col-12 col-lg-9 mb-4'>
            <h1 className="hero-title fw-bold mb-4">
              Ace Every Interview With Your{' '}
              <span className="hero-highlight">
                <span className="highlight-word">Personalized</span>
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
              AI Report
            </h1>
            <p className='col-lg-8 hero-sub text-body-secondary mx-auto'>
              Upload your resume, describe yourself, add the job description — and get a custom AI-generated interview prep report with likely questions and answers in seconds.
            </p>
          </div>

          {/* Water Fill Button */}
          <button className='water-btn mb-4' onClick={()=> { navigate('/generate/interview/report') }}>
            <span className="water-fill"></span>
            <span className="btn-content">
              <span className='btn-label me-3'>Generate My Interview Report</span>
              <span className="btn-icon-wrap">
                <i className="bi bi-arrow-up-right btn-arrow"></i>
              </span>
            </span>
          </button>

          {/* Tags */}
          <div className="col-12 d-flex flex-wrap align-items-center justify-content-center gap-2 text-body-secondary">
            {['Resume Analysis', 'Job Match Scoring', 'Likely Questions', 'Personalized Answers', 'Instant Report'].map(tag => (
              <span key={tag} className='tag-pill border rounded-pill px-3' style={{ paddingBlock: '5px' }}>{tag}</span>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator mt-5">
            <div className="scroll-dot"></div>
            <div className="scroll-dot"></div>
            <div className="scroll-dot"></div>
            <div className="scroll-dot"></div>
            <div className="scroll-dot"></div>
          </div>
        </div>

        {/* ─── SECTION 2: FEATURE CARDS ─── */}
        <section className="section-2 py-5 mb-5">
          <div className="text-center mb-5">
            <span className="section-label mb-2">Why Choose Us</span>
            <h2 className="fw-bold" style={{ fontSize : 'clamp(1.6rem, 3vw, 2.4rem)'}}>Built for <span className="text-gradient">Job Seekers</span></h2>
            <p className="col-lg-6 text-body-secondary mx-auto">Everything you need to walk into your interview with complete confidence.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                icon: 'bi-shield-check',
                color: '#6366f1',
                bg: 'rgba(99,102,241,0.1)',
                title: 'ATS Friendly',
                desc: 'Our reports are structured to help you understand what Applicant Tracking Systems look for — so you never get filtered out.'
              },
              {
                icon: 'bi-robot',
                color: '#a855f7',
                bg: 'rgba(168,85,247,0.1)',
                title: 'AI-Powered',
                desc: 'Powered by the latest large language models, our AI understands your unique profile and the job role deeply.'
              },
              {
                icon: 'bi-lightning-charge-fill',
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.1)',
                title: 'Fast Results',
                desc: 'Get your full personalized interview prep report in under 30 seconds. No waiting, no sign-up friction.'
              },
              {
                icon: 'bi-lock-fill',
                color: '#10b981',
                bg: 'rgba(16,185,129,0.1)',
                title: 'Privacy First',
                desc: 'Your resume and personal data are never stored or shared. Every session is processed and discarded securely.'
              }
            ].map((card, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <div className="feature-card h-100 p-4 rounded-4">
                  <div className="mb-3 rounded-3 d-flex align-items-center justify-content-center" style={{ background: card.bg, width: 52, height: 52 }}>
                    <i className={`bi ${card.icon}`} style={{ fontSize: '1.4rem', color: card.color }}></i>
                  </div>
                  <h5 className="fw-semibold mb-2">{card.title}</h5>
                  <p className="text-body-secondary mb-0" style={{ fontSize: '0.9rem' }}>{card.desc}</p>
                  <div className="card-line mt-3" style={{ background: card.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 3: HOW IT WORKS ─── */}
        <section className="section-3 py-5 mb-4">
          <div className="text-center mb-5">
            <span className="section-label mb-3">How It Works</span>
            <h2 className="fw-bold" style={{ fontSize : 'clamp(1.6rem, 3vw, 2.4rem)'}}>Four Simple <span className="text-gradient">Steps</span></h2>
            <p className="col-lg-6 text-body-secondary mx-auto">From zero to interview-ready in under a minute.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                num: 1,
                numColor: '#6366f1',
                numBg: 'rgba(99,102,241,0.12)',
                title: 'Upload Your Resume',
                desc: 'Paste or type your resume content and AI understands your background.'
              },
              {
                num: 2,
                numColor: '#22c55e',
                numBg: 'rgba(34,197,94,0.12)',
                title: 'Describe Yourself',
                desc: 'Add a short self-description — your strengths, goals, and experience level.'
              },
              {
                num: 3,
                numColor: '#f59e0b',
                numBg: 'rgba(245,158,11,0.12)',
                title: 'Add Job Description',
                desc: 'Paste the job listing so AI matches your profile with the role requirements.'
              },
              {
                num: 4,
                numColor: '#f43f5e',
                numBg: 'rgba(244,63,94,0.12)',
                title: 'Get Your Report',
                desc: 'Receive a full interview prep report with likely questions and tailored answers.'
              },
            ].map((item, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <div className="hiw-card h-100 p-4 rounded-4">
                  <div
                    className="hiw-num-circle mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{ background: item.numBg, color: item.numColor, width: '40px', height:  '40px' }}
                  >
                    <span className="fw-semibold">{item.num}</span>
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ fontSize : '1.1rem'}}>{item.title}</h5>
                  <p className="text-body-secondary mb-0" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="text-center mt-5">
            <button className='water-btn water-btn-sm' onClick={()=> { navigate('/user/register') }}>
              <span className="water-fill"></span>
              <span className="btn-content">
                <span className='btn-label me-3'>Start For Free — Sign Up</span>
                <span className="btn-icon-wrap">
                  <i className="bi bi-arrow-up-right btn-arrow"></i>
                </span>
              </span>
            </button>
            <p className="text-body-secondary mt-3" style={{ fontSize: '0.85rem' }}>
               ✦<span className='mx-2'>No credit card </span> ✦ <span className='mx-2'>Free account</span> ✦ <span className='ms-2'>Instant results</span></p>
          </div>
        </section>

        {/* ─── SECTION 4: SPLIT ─── */}
        <section className="section-4 py-5 mb-5">
          <p className="section-label mb-2">Why It Matters</p>
          <div className="row g-5">
            {/* LEFT */}
            <div className="col-12 col-lg-6">
              <h2 className="fw-bold mb-3" style={{ fontSize : 'clamp(1.5rem, 3vw, 1.8rem)'}}> Stop Guessing, Start <span className="text-gradient">Preparing</span></h2>
              <p className="text-body-secondary" style={{ lineHeight: 1.8 }}>
                Most candidates walk into interviews unprepared. Our AI analyzes your exact profile and the job role — giving you the precise questions you'll likely face and the best way to answer them.
              </p>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-6 d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-3" style={{ fontSize : 'clamp(1.5rem, 3vw, 1.8rem)'}}>Your report. Your words. Your confidence.</h4>
              <p className="text-body-secondary" style={{ lineHeight: 1.8 }}>
                Whether you're a fresher or a seasoned professional, every interview is different. Our report adapts to your background and the role — so you always walk in prepared, not guessing.
              </p>
            </div>

          </div>
        </section>

        <Footer />

      </div>
    </div>
  )
}

export default Home