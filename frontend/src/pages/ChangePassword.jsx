import { useState } from "react";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import PageTransition from "../components/common/PageTransition";
import { changePassword } from "../services/authService";

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to change password. Please try again.";

const ChangePassword = () => {
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
      setStatus({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="auth-page">
      <AuthCard
        eyebrow="Security"
        title="Change password"
        subtitle="Update your account credentials while keeping the session cookie strategy intact."
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
      </AuthCard>
    </PageTransition>
  );
};

export default ChangePassword;
