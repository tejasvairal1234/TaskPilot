import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import TaskPilotLogo from "../components/ui/TaskPilotLogo.jsx";
import { getErrorMessage } from "../utils/helpers.js";
import toast from "react-hot-toast";

const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (PASSWORD_REQUIREMENTS.some((r) => !r.test(form.password))) {
      errs.password = "Password does not meet requirements";
    }
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to TaskPilot 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = PASSWORD_REQUIREMENTS.filter((r) => r.test(form.password)).length;
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];

  return (
    <div className="animate-fade-in">
      {/* Mobile-only logo */}
      <div className="flex lg:hidden items-center gap-2.5 mb-6">
        <TaskPilotLogo size={32} />
        <div>
          <span className="font-bold text-xl text-foreground tracking-tight block leading-tight">
            TaskPilot
          </span>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mt-0.5">
            WORKSPACE
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1.5">Create your account</h1>
        <p className="text-muted-foreground text-sm">Start managing tasks like a pro — for free</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="reg-name"
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          required
        />

        <Input
          id="reg-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
        />

        <div>
          <Input
            id="reg-password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            onFocus={() => setShowReqs(true)}
            required
          />

          {/* Strength meter */}
          {form.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1]
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              {showReqs && (
                <ul className="space-y-0.5 mt-2">
                  {PASSWORD_REQUIREMENTS.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        req.test(form.password)
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        {req.test(form.password) ? (
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <Input
          id="reg-confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mt-2"
        >
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
