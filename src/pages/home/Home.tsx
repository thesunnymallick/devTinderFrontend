import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.firstName ?? "developer"} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#8B5CF6] rounded-lg text-sm font-semibold hover:bg-[#7C5CFF] transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Home;