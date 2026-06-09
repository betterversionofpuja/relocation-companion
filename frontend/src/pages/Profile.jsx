import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import {
  deleteCurrentUser,
  updateCurrentUser,
} from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

const getInitials = (user) =>
  (user?.fullName || user?.username || "RC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const accountNavItems = [
  { label: "Profile", to: "/profile" },
  { label: "Password", to: "/change-password" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const initials = useMemo(() => getInitials(user), [user]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setStatus({ type: "", message: "" });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSubmitting("profile");
    setStatus({ type: "", message: "" });

    try {
      const payload = await updateCurrentUser({
        fullName: form.fullName,
        email: form.email,
      });
      const nextUser = payload?.data || null;
      setUser(nextUser);
      setEditing(false);
      setStatus({ type: "success", message: "Profile updated." });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to update profile."),
      });
    } finally {
      setSubmitting("");
    }
  };

  const handleLogout = async () => {
    setSubmitting("logout");
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setSubmitting("");
    }
  };

  const handleDeleteAccount = async () => {
    setSubmitting("delete");
    setStatus({ type: "", message: "" });

    try {
      await deleteCurrentUser();
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to delete account."),
      });
      setSubmitting("");
    }
  };

  return (
    <PageTransition className="content-shell min-h-[calc(100vh-3.5rem)] py-8 md:py-12">
      <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)] md:items-start">
        <aside className="rounded-xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3 md:grid md:gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold tracking-wide text-slate-200">
              {initials}
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

        <div className="grid gap-6">
          <section className="rounded-xl border border-slate-900 bg-slate-950/50 p-5 shadow-sm backdrop-blur-md md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow">Account Profile</p>
                <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                  {user?.fullName || "Relocation Member"}
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  {user?.email}
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  className="ghost-button min-h-10 rounded-lg px-4 text-sm"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {status.message && (
              <p
                className={`mt-6 rounded-lg border px-4 py-3 text-sm font-bold ${
                  status.type === "success"
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                    : "border-red-300/20 bg-red-400/10 text-red-100"
                }`}
              >
                {status.message}
              </p>
            )}

            {editing ? (
              <form className="mt-6 grid gap-4" onSubmit={handleSaveProfile}>
                <label className="grid gap-2 text-left">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Full Name
                  </span>
                  <input
                    className="select-shell h-10 rounded-lg px-3 text-sm font-semibold"
                    value={form.fullName}
                    onChange={updateField("fullName")}
                    required
                  />
                </label>
                <label className="grid gap-2 text-left">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Email Address
                  </span>
                  <input
                    className="select-shell h-10 rounded-lg px-3 text-sm font-semibold"
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    required
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    className="blue-button min-h-10 rounded-lg px-4 text-sm font-semibold"
                    disabled={submitting === "profile"}
                  >
                    {submitting === "profile" ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="min-h-10 rounded-lg border border-slate-800 px-4 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 grid gap-3 border-t border-slate-900 pt-5 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-900"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-900 disabled:cursor-wait disabled:opacity-60"
                  onClick={handleLogout}
                  disabled={submitting === "logout"}
                >
                  {submitting === "logout" ? "Signing out..." : "Log Out"}
                </button>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-red-300/15 bg-red-400/5 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">
                  Danger Zone
                </p>
                <h2 className="mt-2 text-lg font-bold text-red-50">
                  Delete account
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100/80">
                  This permanently deletes your account and saved comparisons.
                </p>
              </div>
              {!confirmDelete && (
                <button
                  type="button"
                  className="min-h-10 rounded-lg border border-red-300/25 px-4 text-sm font-bold text-red-100 transition hover:bg-red-400/10"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete Account
                </button>
              )}
            </div>

            {confirmDelete && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-red-300/30 px-4 text-sm font-black text-red-100 transition hover:bg-red-400/10 disabled:cursor-wait disabled:opacity-60"
                  onClick={handleDeleteAccount}
                  disabled={submitting === "delete"}
                >
                  {submitting === "delete" ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-black text-slate-300 transition hover:bg-white/[0.04]"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep Account
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
