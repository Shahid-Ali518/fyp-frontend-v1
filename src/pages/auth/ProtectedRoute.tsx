import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // Array of roles that can access this route
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "USER" or "ADMIN"
  const location = useLocation();

  // 1. Check if authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if role is authorized
  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    // If a user tries to access admin, send them back to home or a 403 page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;