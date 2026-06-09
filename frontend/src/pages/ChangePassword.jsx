import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthButton from "../components/auth/AuthButton";
import AuthInput from "../components/auth/AuthInput";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import { changePassword } from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

const accountNavItems = [
  { label: "Profile", to: "/profile" },
  { label: "Password", to: "/change-password" },
];

const getInitials = (user) =>
  (user?.fullName || user?.username || "RC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ChangePassword = () => {
  const { user } = useAuth();
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.currentPassword) nextErrors.currentPassword = "Current password is required.";
    if (!values.newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (values.newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters.";
    }
    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your new password.";
    } else if (values.newPassword !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStatus({ type: "success", message: "Password changed successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to change password. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="content-shell min-h-[calc(100vh-3.5rem)] py-8 md:py-12">
      <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)] md:items-start">
        <aside className="rounded-xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 md:grid md:gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold tracking-wide text-slate-200">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">
                {user?.fullName || "Relocation Member"}
              </p>
              <p className="truncate text-xs font-medium text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          <nav className="mt-4 grid gap-2" aria-label="Account settings">
            {accountNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="rounded-xl border border-slate-900 bg-slate-950/50 p-5 shadow-sm backdrop-blur-md md:p-6">
          <div>
            <p className="eyebrow">Security</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Change password
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Update your account credentials while keeping your profile and saved comparisons intact.
            </p>
          </div>

          <form className="auth-form max-w-xl" onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="currentPassword"
              label="Current Password"
              type="password"
              autoComplete="current-password"
              value={values.currentPassword}
              onChange={updateValue("currentPassword")}
              error={errors.currentPassword}
            />
            <AuthInput
              id="newPassword"
              label="New Password"
              type="password"
              autoComplete="new-password"
              value={values.newPassword}
              onChange={updateValue("newPassword")}
              error={errors.newPassword}
            />
            <AuthInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={updateValue("confirmPassword")}
              error={errors.confirmPassword}
            />

            {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}

            <AuthButton type="submit" loading={submitting}>
              Update Password
            </AuthButton>
          </form>
        </section>
      </div>
    </PageTransition>
  );
};

export default ChangePassword;
