import { Navigate, useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

function AdminRoute({ children }) {
  const user = getUserFromToken();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;