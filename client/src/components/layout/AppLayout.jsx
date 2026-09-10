import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileSidebar from "./MobileSidebar.jsx";
import Header from "./Header.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const SIDEBAR_COLLAPSED_KEY = "taskpilot-sidebar-collapsed";

const AppLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sign out confirmation dialog
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch (e) {
        console.error("Failed to save sidebar state", e);
      }
      return next;
    });
  };

  const handleSignOutConfirm = async () => {
    setSigningOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Error signing out");
    } finally {
      setSigningOut(false);
      setSignOutDialogOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        onSignOutClick={() => setSignOutDialogOpen(true)}
      />

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onSignOutClick={() => setSignOutDialogOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* Page View Area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-background transition-colors duration-200 focus:outline-none"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <ConfirmDialog
        isOpen={signOutDialogOpen}
        onClose={() => !signingOut && setSignOutDialogOpen(false)}
        onConfirm={handleSignOutConfirm}
        loading={signingOut}
        title="Sign out of TaskPilot?"
        message="Are you sure you want to sign out? You will need to log back in to access your dashboard and tasks."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AppLayout;
