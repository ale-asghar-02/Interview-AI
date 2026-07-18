import { React, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Carousel from '../components/Carosual';

import formGif from '../../../assets/form.gif';
import googleIcon from '../../../assets/google.svg';

import Swal from 'sweetalert2';
import '../auth.scss';

const Register = () => {

  const navigate = useNavigate();
  const { handleRegister, handleGoogleAuth, loading } = useAuth();

  const [usernameFocus, setUsernameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({ username: '', email: '', password: '' });

  // ── Submit Register ──
  const submitRegisterHandler = async (e) => {
    e.preventDefault();

    const newErrors = { username: '', email: '', password: '' };
    let hasError = false;

    if (!username) {
      newErrors.username = 'Username is required.';
      hasError = true;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      hasError = true;
    }

    if (!email) {
      newErrors.email = 'Email is required.';
      hasError = true;
    } else if (email.length < 13) {
      newErrors.email = 'Email must be at least 13 characters long.';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const response = await handleRegister({ username, email, password });
    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'Account Created! 🎉',
        text: 'Your account has been created successfully. Welcome aboard!',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: "Let's Go!",
      });
      navigate('/');
    }
  };

  // ── Google Auth ──
  const googleAuthHandler = () => { handleGoogleAuth() };

  if (loading) {
    return (
      <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-body-secondary">Creating your account...</p>
        </div>
      </main>
    );
  }

  return (
    <div className='container-fluid form-section'>
      <div className='row'>
        <div className="col-12 col-lg-6 d-none d-md-block form-left-side">
          <span className="ls-shape ls-rect-1" />
          <span className="ls-shape ls-rect-2" />
          <span className="ls-shape ls-rect-dots" />
          <span className="ls-shape ls-tri-1" />
          <span className="ls-shape ls-tri-2" />
          <span className="ls-shape ls-circle-1" />
          <span className="ls-shape ls-circle-2" />
          <span className="ls-shape ls-circle-sm" />
          <span className="ls-shape ls-circle-dots" />
          <span className="ls-shape ls-star ls-star-1" />
          <span className="ls-shape ls-star ls-star-2" />
          <span className="ls-shape ls-star ls-star-3" />
          <div className='container px-0 px-md-5 py-md-5'>
            <Link className="nav-logo text-decoration-none" to={'/'}>
              <span className="text-white fw-light">Interview AI</span>
            </Link>
            <Carousel />
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-xl-7 d-flex flex-column align-items-center justify-content-center text-center px-3">

            <div
              className='d-flex align-items-center justify-content-center border rounded-pill overflow-hidden mb-3'
              style={{ width: '85px', height: '85px' }}
            >
              <img src={formGif} width={'60px'} alt="register icon" />
            </div>

            <h3 className='fw-semibold'>Hello Again!</h3>
            <p className='text-body-secondary mb-4'>
              Enter your details to create a new account and start your journey.
            </p>

            <form onSubmit={submitRegisterHandler} className='col-12 mb-4'>

              <div className="col-12 mb-1 position-relative">
                <input
                  name='username'
                  type="text"
                  className={`form-control py-3 ${errors.username ? 'is-invalid' : ''}`}
                  style={{ paddingRight: '45px' }}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors((prev) => ({ ...prev, username: '' })); }}
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                />
                <span className='position-absolute top-50 translate-middle' style={{ right: '2px' }}>
                  {!errors.username && (
                    <i className={`ri-user-3-line fs-5 ${usernameFocus ? 'text-primary' : 'text-body-secondary'}`} />
                  )}
                </span>
              </div>
              {errors.username
                ? <div className="text-start mb-3"><small className="text-danger">{errors.username}</small></div>
                : <div className="mb-3" />
              }

              <div className="col-12 mb-1 position-relative">
                <input
                  name='email'
                  type="email"
                  className={`form-control py-3 ${errors.email ? 'is-invalid' : ''}`}
                  style={{ paddingRight: '45px' }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <span className='position-absolute top-50 translate-middle' style={{ right: '2px' }}>
                  {!errors.email && (
                    <i className={`ri-at-line fs-5 ${emailFocus ? 'text-primary' : 'text-body-secondary'}`} />
                  )}
                </span>
              </div>
              {errors.email
                ? <div className="text-start mb-3"><small className="text-danger">{errors.email}</small></div>
                : <div className="mb-3" />
              }

              <div className="col-12 mb-1 position-relative">
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control py-3 ${errors.password ? 'is-invalid' : ''}`}
                  style={{ paddingRight: '45px' }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                    setShowPassword(false);
                  }}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <span
                  className='position-absolute top-50 translate-middle'
                  style={{ right: '2px', marginTop: '2px', cursor: errors.password ? 'default' : 'pointer' }}
                  onClick={() => { if (!errors.password) setShowPassword((prev) => !prev); }}
                >
                  {!errors.password && (
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} fs-5 ${passwordFocus ? 'text-primary' : 'text-body-secondary'}`} />
                  )}
                </span>
              </div>
              {errors.password
                ? <div className="text-start mb-3"><small className="text-danger">{errors.password}</small></div>
                : <div className="mb-3" />
              }

              <button
                type='submit'
                className='btn btn-primary w-100 mb-3'
                style={{ paddingBlock: '10px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Creating account...
                  </>
                ) : 'Create your Account'}
              </button>

              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-body-secondary" style={{ fontSize: '0.85rem' }}>or continue with</span>
                <hr className="flex-grow-1" />
              </div>

              <button
                type='button'
                className='btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center'
                style={{ paddingBlock: '10px' }}
                onClick={googleAuthHandler}
              >
                <img className='me-3' src={googleIcon} width={'22px'} alt="Google" />
                <span>Sign up with Google</span>
              </button>

            </form>

            <p className='text-body-secondary mb-0'>
              Already have an account?{' '}
              <span
                className='text-primary fw-medium'
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/user/login')}
              >
                Sign In
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;