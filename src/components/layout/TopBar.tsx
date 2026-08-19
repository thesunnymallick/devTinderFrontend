import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Notification03Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { pending } = useAppSelector((state) => state.connections);
  const receivedCount = pending.filter((p) => p.type === "RECEIVED").length;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-[#2A2A35]">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-[#18181B] transition-colors"
        aria-label="Open menu"
      >
        <HugeiconsIcon icon={Menu01Icon} size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => navigate("/requests")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-[#18181B] transition-colors"
          aria-label="Requests"
        >
          <HugeiconsIcon icon={Notification03Icon} size={19} />
          {receivedCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-[#8B5CF6] text-white">
              {receivedCount}
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#18181B] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#18181B] border border-[#2A2A35] overflow-hidden flex items-center justify-center text-xs font-semibold text-slate-300 shrink-0">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-200">
              {user?.firstName ?? "Account"}
            </span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-slate-500 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#141418] border border-[#2A2A35] rounded-xl shadow-xl overflow-hidden py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#18181B] transition-colors"
              >
                Edit profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#18181B] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;