import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import NavItem from "../navigation/NavItem.jsx";
import Tooltip from "../ui/Tooltip.jsx";
import TaskPilotLogo from "../ui/TaskPilotLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/helpers.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/tasks/create", label: "Create Task", icon: PlusCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ collapsed, onToggleCollapse, onSignOutClick }) => {
  const { user } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-sidebar text-foreground border-r border-border transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-label="Desktop Sidebar"
    >
      {/* ─── Logo Header ────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 overflow-hidden ${
            collapsed ? "justify-center w-full" : ""
          }`}
          aria-label="TaskPilot Home"
        >
          {/* Authentic TaskPilot Logo */}
          <TaskPilotLogo size={36} className="shrink-0" />

          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <span className="font-bold text-foreground text-base tracking-tight block leading-tight">
                TaskPilot
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mt-0.5">
                WORKSPACE
              </p>
            </div>
          )}
        </Link>

        {/* Collapse Button (visible when expanded) */}
        {!collapsed && (
          <Tooltip text="Collapse sidebar" position="right">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* ─── Navigation Links ────────────────────────────────────── */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* ─── Bottom Area: Profile + Sign Out ────────────────────────── */}
      <div className="p-3 border-t border-border space-y-2">
        {/* User Profile Card */}
        {collapsed ? (
          <div className="flex justify-center py-1">
            <Tooltip
              text={`${user?.name || "User"} (${user?.email || ""})`}
              position="right"
            >
              <Link
                to="/settings"
                className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all"
                aria-label="View user profile"
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    {getInitials(user?.name || "U")}
                  </span>
                )}
              </Link>
            </Tooltip>
          </div>
        ) : (
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
            aria-label="Account Settings"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user?.name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-primary">
                  {getInitials(user?.name || "U")}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </Link>
        )}

        {/* Compact Sign Out Button */}
        {collapsed ? (
          <div className="flex justify-center">
            <Tooltip text="Sign out" position="right">
              <button
                type="button"
                onClick={onSignOutClick}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSignOutClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="truncate">Sign out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
