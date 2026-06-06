import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/common/LoadingScreen";

const ProtectedRoute = ({ children }) => {
  const { user, authReady, loading } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
