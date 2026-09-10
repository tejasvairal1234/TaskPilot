import { useLocation, Link } from "react-router-dom";
import { PanelLeftClose, PanelLeft, Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import Tooltip from "../ui/Tooltip.jsx";
import TaskPilotLogo from "../ui/TaskPilotLogo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/helpers.js";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/tasks": "My Tasks",
  "/tasks/create": "Create Task",
  "/settings": "Settings",
};

const Header = ({ collapsed, onToggleCollapse, onOpenMobileDrawer }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Determine current page title
  let currentTitle = routeTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.startsWith("/tasks/edit/") || location.pathname.includes("/edit")) {
      currentTitle = "Edit Task";
    } else {
      currentTitle = "TaskPilot";
    }
  }

  return (
    <header className="h-16 px-4 lg:px-6 bg-header text-foreground border-b border-border flex items-center justify-between transition-colors duration-200 shrink-0 z-10">
      {/* Left section: Toggles and Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse button */}
        <div className="hidden lg:block">
          <Tooltip
            text={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            position="bottom"
          >
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>

        {/* Mobile Logo Title */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <TaskPilotLogo size={28} />
          <span className="font-bold text-foreground text-base tracking-tight">
            TaskPilot
          </span>
        </div>

        {/* Desktop Page Title / Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            WORKSPACE
          </span>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="text-base font-bold text-foreground">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right section: Theme toggle and User profile summary */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="h-5 w-[1px] bg-border" aria-hidden="true" />

        {/* User avatar / profile button linking to settings */}
        <Tooltip text={`Signed in as ${user?.name || "User"}`} position="bottom">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all"
            aria-label="View profile settings"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
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
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-foreground truncate max-w-[120px]">
              {user?.name || "Account"}
            </span>
          </Link>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
