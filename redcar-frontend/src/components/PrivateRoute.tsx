import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx'; // Assuming you have this context

// Type for the props of the PrivateRoute component
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // If no token is found, redirect to login page
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;