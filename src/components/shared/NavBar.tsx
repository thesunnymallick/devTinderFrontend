import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
    isActive ? "bg-[#8B5CF6]/15 text-violet-300" : "text-slate-400 hover:text-slate-200"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
    isActive
      ? "bg-[#8B5CF6]/15 text-violet-300 border-[#8B5CF6]/40"
      : "text-slate-400 border-[#2A2A35]"
  }`;

const links = [
  { to: "/", label: "Discover", end: true },
  { to: "/requests", label: "Requests", end: false },
  { to: "/connections", label: "Matches", end: false },
  { to: "/profile", label: "Profile", end: false },
];

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="border-b border-[#2A2A35] bg-[#0D0D0F] sticky top-0 z-10">
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-lg font-bold text-white shrink-0">
          <span className="text-indigo-400">Dev</span>Tinder
        </h1>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden md:inline">
            Hi, {user?.firstName ?? "there"}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-slate-300 border border-[#2A2A35] rounded-lg hover:bg-[#18181B] transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="sm:hidden flex items-center gap-2 px-5 pb-3 overflow-x-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={mobileLinkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default NavBar;