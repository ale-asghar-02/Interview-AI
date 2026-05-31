import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import Login from './features/auth/pages/Login';
import ResetPassword from './features/auth/pages/ResetPassword';
import Register from './features/auth/pages/Register';
import UserDashboard from './pages/UserDashboard';
import GenerateInterviewReport from './features/interview/pages/GenerateInterviewReport';
import InterviewReport from './features/interview/pages/InterviewReport';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndCondition from './pages/TermsAndCondition';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home />
    },
    {
        path:'/user/login',
        element:<PublicRoute><Login /></PublicRoute>
    },
    {
        path:'/user/reset-password/:token',
        element:<PublicRoute><ResetPassword /></PublicRoute>
    },
    {
        path:'/user/register',
        element:<PublicRoute><Register /></PublicRoute>
    },
    {
        path:'/user/dashboard',
        element:<ProtectedRoute><UserDashboard /></ProtectedRoute>
    },
    {
        path:'/generate/interview/report',
        element:<ProtectedRoute><GenerateInterviewReport /></ProtectedRoute>
    },
    {
        path:'/interview/report/:id',
        element:<ProtectedRoute><InterviewReport /></ProtectedRoute>
    },
    {
        path:'/privacy-policy',
        element:<PrivacyPolicy />
    },
    {
        path:'/terms-and-condition',
        element:<TermsAndCondition />
    },
    {
        path:'*',
        element:<NotFound />
    }
]);