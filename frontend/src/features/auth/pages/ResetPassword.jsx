import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';
import '../auth.scss';

const ResetPassword = () => {

  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, handleResetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const submitResetPasswordHandler = async (e) => {
    e.preventDefault();

    const newErrors = { password: '', confirmPassword: '' };
    let hasError = false;

    if (!password) {
      newErrors.password = 'Password is required.';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const response = await handleResetPassword({ token, password });
    if (response) {
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful!',
        text: 'Your password has been updated successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0d6efd',
      });
      navigate('/user/login');
    }
  };

  if (loading) {
    return (
      <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-body-secondary">Updating your password...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="col-11 col-lg-8 col-xl-6 d-flex flex-column align-items-center justify-content-center text-center px-3">

        <h3 className='fw-semibold'>Reset Your Password</h3>
        <p className='text-body-secondary mb-4'>
          Create a strong new password for your account. It must be at least 6 characters long.
        </p>

        <form onSubmit={submitResetPasswordHandler} className='col-12 mb-4'>

          <div className="col-12 mb-1 position-relative">
            <input
              name='password'
              type={showPassword ? 'text' : 'password'}
              className={`form-control py-3 ${errors.password ? 'is-invalid' : ''}`}
              style={{ paddingRight: '45px' }}
              placeholder="New Password"
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

          <div className="col-12 mb-1 position-relative">
            <input
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-control py-3 ${errors.confirmPassword ? 'is-invalid' : ''}`}
              style={{ paddingRight: '45px' }}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                setShowConfirmPassword(false);
              }}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
            />
            <span
              className='position-absolute top-50 translate-middle'
              style={{ right: '2px', marginTop: '2px', cursor: errors.confirmPassword ? 'default' : 'pointer' }}
              onClick={() => { if (!errors.confirmPassword) setShowConfirmPassword((prev) => !prev); }}
            >
              {!errors.confirmPassword && (
                <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} fs-5 ${confirmPasswordFocus ? 'text-primary' : 'text-body-secondary'}`} />
              )}
            </span>
          </div>
          {errors.confirmPassword
            ? <div className="text-start mb-3"><small className="text-danger">{errors.confirmPassword}</small></div>
            : <div className="mb-3" />
          }

          <button
            type='submit'
            className='btn btn-primary w-100'
            style={{ paddingBlock: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Resetting...
              </>
            ) : 'Reset Password'}
          </button>

        </form>

        <p className='text-body-secondary mb-0'>
          Remember your password?{' '}
          <span
            className='text-primary fw-medium'
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/user/login')}
          >
            Back to Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;