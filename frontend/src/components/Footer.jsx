import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router'

const Footer = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className='footer-section'>
        <footer className="py-2 mt-5">
          <div className="row align-items-center g-3">

            <div className="col-12 col-md-4">
              <Link className="nav-logo text-decoration-none text-dark" to={'/'}>
                <span className="logo-text">Interview<span className="text-gradient">AI</span></span>
              </Link>
            </div>

            <div className="col-12 col-md-4 text-center">
              <p className="text-body-secondary mb-0" style={{ fontSize: '0.85rem' }}>
                © 2026 InterviewAI. All rights reserved.
              </p>
            </div>

            <div className="col-12 col-md-4 d-flex justify-content-md-end gap-3">
                <Link className='footer-link fw-light' to={'/privacy-policy'}>Privacy Policy</Link>
                <Link className='footer-link fw-light' to={'/terms-and-condition'}>Terms & condition</Link>
            </div>

          </div>

          <div className="footer-line mt-4"></div>
        </footer>
    </div>
  )
}

export default Footer