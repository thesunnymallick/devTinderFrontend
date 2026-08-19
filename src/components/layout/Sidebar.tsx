import React from "react";
import { NavLink } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  UserGroupIcon,
  Message01Icon,
  BookmarkAdd01Icon,
  UserIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { useAppSelector } from "../../store/hooks";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home01Icon;
  end?: boolean;
  badgeCount?: number;
  disabled?: boolean;
}

interface SidebarProps {
  /** Controls the mobile drawer; ignored on desktop (always visible). */
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { pending } = useAppSelector((state) => state.connections);
  const receivedCount = pending.filter((p) => p.type === "RECEIVED").length;

  const items: NavItem[] = [
    { to: "/", label: "Discover", icon: Home01Icon, end: true },
    { to: "/requests", label: "Requests", icon: UserGroupIcon, badgeCount: receivedCount },
    { to: "/connections", label: "Matches", icon: UserGroupIcon },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];

  const comingSoon: Omit<NavItem, "to">[] = [
    { label: "Chat", icon: Message01Icon, disabled: true },
    { label: "Bookmarks", icon: BookmarkAdd01Icon, disabled: true },
    { label: "Settings", icon: Settings02Icon, disabled: true },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#8B5CF6]/15 text-violet-300"
        : "text-slate-400 hover:text-slate-200 hover:bg-[#18181B]"
    }`;

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0D0D0F] border-r border-[#2A2A35] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            <span className="text-indigo-400">Dev</span>Tinder
          </span>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-300"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={onClose}>
              <HugeiconsIcon icon={item.icon} size={19} />
              <span className="flex-1">{item.label}</span>
              {!!item.badgeCount && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-semibold rounded-full bg-[#8B5CF6] text-white">
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-3 mt-3 border-t border-[#2A2A35] space-y-1">
            {comingSoon.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 cursor-not-allowed"
              >
                <HugeiconsIcon icon={item.icon} size={19} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-700 border border-[#2A2A35] rounded px-1.5 py-0.5">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </nav>

        <div className="px-5 py-4 text-xs text-slate-600">
          DevTinder © 2026
          <br />
          Made with ♥ for developers
        </div>
      </aside>
    </>
  );
};

export default Sidebar;