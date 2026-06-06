import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import { registerUser } from "../services/authService";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to create account. Please try again.";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [values, setValues] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!values.username.trim()) nextErrors.username = "Username is required.";
    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
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
      await registerUser({
        fullName: values.fullName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setStatus({ type: "success", message: "Account created. Redirecting to sign in." });
      setTimeout(() => navigate("/login", { replace: true }), 700);
    } catch (error) {
      setStatus({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="auth-page">
      <AuthCard
        eyebrow="Create Workspace"
        title="Create your account"
        subtitle="Start building a trusted relocation profile for smarter city decisions."
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="fullName"
            label="Full Name"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={updateValue("fullName")}
            error={errors.fullName}
          />
          <AuthInput
            id="username"
            label="Username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={updateValue("username")}
            error={errors.username}
          />
          <AuthInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={updateValue("email")}
            error={errors.email}
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={updateValue("password")}
            error={errors.password}
          />

          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}

          <AuthButton type="submit" loading={submitting}>
            Create Account
          </AuthButton>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </AuthCard>
    </PageTransition>
  );
};

export default Register;
