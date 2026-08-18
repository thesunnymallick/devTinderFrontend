import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../../store/hooks";

interface PublicRouteProps {
  children: JSX.Element;
}

/**
 * Wrap routes like /login and /signup so an already-authenticated user
 * gets redirected to the app instead of seeing the auth forms again.
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, authChecked } = useAppSelector((state) => state.auth);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F]">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;