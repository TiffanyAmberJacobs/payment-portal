import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'employee' ? '/employee' : '/customer'} replace />;
  }

  return children;
};

export default ProtectedRoute;