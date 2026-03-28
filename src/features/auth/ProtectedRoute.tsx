// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Replace this with real auth logic
  return !!localStorage.getItem("token");
};

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;