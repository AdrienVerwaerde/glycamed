import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedAmedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "amed") {
    return <Navigate to="/" replace />;
  }

  return children;
}
