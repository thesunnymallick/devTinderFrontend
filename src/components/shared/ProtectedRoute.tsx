import type { JSX } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: JSX.Element;
}

/**
 * Wrap any route that requires a logged-in user, e.g:
 * <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, authChecked } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Wait for the initial checkAuthUser() call (dispatched in App) to resolve
  // before deciding — otherwise a logged-in user gets bounced on refresh.
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F]">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;