import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import NavItem from "../navigation/NavItem.jsx";
import TaskPilotLogo from "../ui/TaskPilotLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/helpers.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/tasks/create", label: "Create Task", icon: PlusCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

const MobileSidebar = ({ isOpen, onClose, onSignOutClick }) => {
  const { user } = useAuth();

  // Prevent background scrolling while mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-sidebar text-foreground border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer Header with Logo and Close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3">
            <TaskPilotLogo size={36} />
            <div>
              <span className="font-bold text-foreground text-base tracking-tight block leading-tight">
                TaskPilot
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mt-0.5">
                WORKSPACE
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* User Profile & Sign Out Bottom Area */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
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
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOutClick();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
