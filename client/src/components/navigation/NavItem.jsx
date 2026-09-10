import { NavLink } from "react-router-dom";
import Tooltip from "../ui/Tooltip.jsx";

const NavItem = ({ to, label, icon: Icon, collapsed = false, onClick }) => {
  return (
    <Tooltip text={collapsed ? label : ""} position="right" disabled={!collapsed}>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 select-none
          ${collapsed ? "w-11 h-11 justify-center p-0 mx-auto" : "w-full px-3.5 py-2.5"}
          ${
            isActive
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active Left Indicator */}
            {isActive && (
              <span
                className={`absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full ${
                  collapsed ? "-left-1" : "left-0"
                }`}
                aria-hidden="true"
              />
            )}

            {/* Icon */}
            <Icon
              className={`shrink-0 transition-colors duration-150 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
              size={20}
              strokeWidth={isActive ? 2.2 : 1.75}
            />

            {/* Label (hidden in collapsed mode) */}
            {!collapsed && (
              <span className="truncate tracking-wide">{label}</span>
            )}
          </>
        )}
      </NavLink>
    </Tooltip>
  );
};

export default NavItem;
