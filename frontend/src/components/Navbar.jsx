import React from 'react'
import { useNavigate , Link } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth.js'

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className='col-12 d-flex align-items-center justify-content-between py-3 py-lg-4 navbar'>
      <Link className="nav-logo text-decoration-none" to={'/'}>
        <span className="logo-text text-dark">Interview<span className="logo-accent">AI</span></span>
      </Link>

     { user ? (
        <div className='d-flex align-items-center gap-3 gap-lg-4'>
          <div className='d-flex align-items-center gap-2' style={{ cursor : 'pointer' }} onClick={() => navigate('/user/dashboard')}>
            <div className='border rounded-pill bg-dark overflow-hidden' style={{ width : '35px' , height : '35px'}}>
              <img className='w-100 h-100 object-fit-cover' src={
                user?.userImage
                  ? user.userImage
                  : "../../src/assets/images/default.jpg"
              } alt="profile_img" />
            </div>
            <p className='mb-0 text-truncate' style={{ maxWidth : '100px'}}>{user.username}</p>
          </div>
        </div>
     ) : (
        <button className="nav-btn" onClick={() => navigate('/user/login')}>
          <span className="nav-btn-fill"></span>
          <span className="nav-btn-text">Sign In</span>
          <i className="bi bi-arrow-right nav-btn-arrow"></i>
        </button>
     )}
    
    </div>
  )
}

export default Navbar