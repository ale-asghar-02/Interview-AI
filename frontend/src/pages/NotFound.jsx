import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import Loading from '../routes/Loading';

const NotFound = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) { return <Loading /> }

  return (
    <div className="overflow-x-hidden position-relative px-3 notFound-section">

      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="grid-overlay"></div>

      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ height : '100vh' }}>
        <div className="col-12 d-flex justify-content-center mb-4">
          <img src="../../src/assets/404.gif" width={300} alt="404.gif" />
        </div>
        <div className="col-12 text-center mb-4">
          <h2 className='fw-bold' style={{ color : '#3F3D54' }}>Oops! Somethimg wents wrong</h2>
          <p className='text-body-tertiary'> The page you're trying to reach isn’t available.</p>
        </div>
        <button className='btn-back' onClick={()=> { navigate('/') }}>
          <i class="bi bi-backspace-reverse me-3"></i>
          <span>Go Back</span>
        </button>
      </div>
      
    </div>
  );
};

export default NotFound;