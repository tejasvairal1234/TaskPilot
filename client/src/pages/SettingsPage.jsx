import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Monitor,
  User,
  Lock,
  Trash2,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { authService } from "../services/authService.js";
import { getErrorMessage } from "../utils/helpers.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import toast from "react-hot-toast";

const SectionCard = ({ title, description, icon: Icon, children }) => (
  <div className="card shadow-sm space-y-6">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
          <Icon size={18} />
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-card-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const setProfile = (field) => (e) =>
    setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setPassword = (field) => (e) =>
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ─── Profile Update ────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileForm.name.trim()) errs.name = "Name is required";
    else if (profileForm.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }
    setProfileErrors({});
    setProfileLoading(true);
    try {
      const { data } = await authService.updateMe({
        name: profileForm.name.trim(),
      });
      updateUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Password Change ───────────────────────────────────────────────────────
  const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One number", test: (p) => /[0-9]/.test(p) },
    { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword)
      errs.currentPassword = "Current password is required";
    if (!passwordForm.newPassword)
      errs.newPassword = "New password is required";
    else if (
      PASSWORD_REQUIREMENTS.some((r) => !r.test(passwordForm.newPassword))
    ) {
      errs.newPassword = "Password does not meet requirements";
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errs.confirmNewPassword = "Passwords do not match";
    }
    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }
    setPasswordErrors({});
    setPasswordLoading(true);
    try {
      await authService.updateMe({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  // ─── Delete Account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await authService.deleteMe();
      await logout();
      toast.success("Account deleted. Goodbye!");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      description: "Clean & crisp light appearance",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark",
      description: "Sleek SaaS dark theme",
      icon: Moon,
    },
    {
      id: "system",
      label: "System",
      description: "Follows your device OS settings",
      icon: Monitor,
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title mb-1 text-2xl lg:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your preferences, account details, and security.
        </p>
      </div>

      {/* ─── Appearance Section ──────────────────────────────────── */}
      <SectionCard
        title="Appearance"
        description="Choose how TaskPilot looks and feels on your device"
        icon={Sun}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30 bg-card"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-card-foreground block mb-0.5">
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground leading-normal">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ─── Profile Section ─────────────────────────────────────── */}
      <SectionCard
        title="Profile"
        description="Update your display name and view account info"
        icon={User}
      >
        <form onSubmit={handleProfileSubmit} noValidate className="space-y-4">
          <Input
            id="settings-name"
            label="Full Name"
            type="text"
            value={profileForm.name}
            onChange={setProfile("name")}
            error={profileErrors.name}
            required
          />
          <Input
            id="settings-email"
            label="Email Address"
            type="email"
            value={user?.email || ""}
            disabled
            hint="Email cannot be changed."
          />
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={profileLoading}
              disabled={profileLoading}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* ─── Security Section ────────────────────────────────────── */}
      <SectionCard
        title="Security"
        description="Change your password to keep your account protected"
        icon={Lock}
      >
        <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
          <Input
            id="settings-current-password"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={passwordForm.currentPassword}
            onChange={setPassword("currentPassword")}
            error={passwordErrors.currentPassword}
            autoComplete="current-password"
            required
          />
          <Input
            id="settings-new-password"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={passwordForm.newPassword}
            onChange={setPassword("newPassword")}
            error={passwordErrors.newPassword}
            autoComplete="new-password"
            required
            hint="Min 8 chars, 1 uppercase, 1 number, 1 special character"
          />
          <Input
            id="settings-confirm-password"
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={passwordForm.confirmNewPassword}
            onChange={setPassword("confirmNewPassword")}
            error={passwordErrors.confirmNewPassword}
            autoComplete="new-password"
            required
          />
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={passwordLoading}
              disabled={passwordLoading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* ─── Danger Zone ─────────────────────────────────────────── */}
      <div className="card border-danger/30 bg-danger/5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-danger mb-1 flex items-center gap-2">
            <Trash2 size={18} />
            <span>Danger Zone</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated tasks. This
            action <strong>cannot be undone</strong>.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex items-center gap-2"
        >
          <Trash2 size={16} />
          <span>Delete My Account</span>
        </Button>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
        title="Delete your account?"
        message="All your tasks, activity, and personal data will be permanently deleted. This cannot be undone."
        confirmLabel="Yes, delete everything"
      />
    </div>
  );
};

export default SettingsPage;
