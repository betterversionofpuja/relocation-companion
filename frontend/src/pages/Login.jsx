import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authErrors";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    if (!values.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await login({ email: values.email.trim(), password: values.password });
      setStatus({ type: "success", message: "Signed in successfully." });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to sign in. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-accent)]">
            Welcome back
          </p>
          <h1 className="font-display mt-3 text-2xl font-bold leading-tight text-[var(--text-primary)]">
            Log in to Relocation Companion
          </h1>
        </div>

        <form className="mt-7 grid gap-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2">
            <label
              className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={updateValue("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="m-0 text-sm font-bold text-[var(--loss-primary)]">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label
              className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={updateValue("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="m-0 text-sm font-bold text-[var(--loss-primary)]">
                {errors.password}
              </p>
            )}
          </div>

          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}

          <button
            className="primary-button h-12 w-full px-4 text-base shadow-[0_18px_48px_rgba(14,165,233,0.24)] disabled:cursor-wait"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          New to Relocation Companion?{" "}
          <Link className="auth-link" to="/register">
            Create Account
          </Link>
        </p>
      </section>
    </PageTransition>
  );
};

export default Login;
