import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Login from "./pages/auth/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Signup Route */}
        {/* <Route path="/signup" element={<DevTinderSignup />} /> */}

        {/* Default Route - Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Simple 404 Component
const NotFound: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-400 mb-8">Page not found</p>
      <a
        href="/login"
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
      >
        Back to Login
      </a>
    </div>
  </div>
);

export default App;
