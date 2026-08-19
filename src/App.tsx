import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAppDispatch } from "./store/hooks";
import { checkAuthUser } from "./store/authSlice";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicRoute from "./components/shared/PublicRoute";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Requests from "./pages/requests/Requests";
import Connections from "./pages/connections/Connections";
import NotFound from "./pages/others/NotFound";

const AppRoutes = () => {
  const dispatch = useAppDispatch();

  // Check once on load whether the auth cookie from a previous session is still valid.
  useEffect(() => {
    dispatch(checkAuthUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connections"
        element={
          <ProtectedRoute>
            <Connections />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;