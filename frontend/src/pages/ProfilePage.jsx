import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
} from "../api/authApi";

import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const navigate = useNavigate();

  const { setUser, setSavedComparisons } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getCurrentUser();

        setProfileData({
          fullName: user.fullName,
          username: user.username,
          email: user.email,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async () => {
    try {
      setSavingProfile(true);

      await updateProfile(profileData);

      alert("Profile updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setSavingPassword(true);

      await changePassword(passwordData);

      alert("Password changed successfully.");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logoutUser();

      setUser(null);
      setSavedComparisons([]);

      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
  <>
    <div className="h-16 bg-[#050816]" />

    <section className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Manage your account information and security.
        </p>

      </div>

      {/* Profile Banner */}

      <div className="rounded-2xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-5">

        <div className="flex items-center gap-4">

          <div
            className="
              h-14
              w-14
              rounded-full
              bg-gradient-to-br
              from-blue-500
              to-cyan-400
              flex
              items-center
              justify-center
              text-xl
              font-bold
              text-white
              shrink-0
            "
          >
            {profileData.fullName.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2 className="text-2xl font-semibold text-white">
              {profileData.fullName}
            </h2>

            <p className="mt-1 text-blue-400 text-sm">
              @{profileData.username}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {profileData.email}
            </p>

          </div>

        </div>

      </div>

      {/* Cards */}

      <div className="grid lg:grid-cols-2 gap-5 mt-6">

        {/* Personal Information */}

        <div className="rounded-2xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-4">
            Personal Information
          </h2>

          <div className="space-y-4">

            <div>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className="mt-1.5 w-full h-10 rounded-xl border border-blue-500/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <div>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                className="mt-1.5 w-full h-10 rounded-xl border border-blue-500/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <div>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="mt-1.5 w-full h-10 rounded-xl border border-blue-500/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <button
              onClick={handleProfileUpdate}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm font-medium text-white"
            >
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>

        {/* Password */}

        <div className="rounded-2xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-4">
            Change Password
          </h2>

          <div className="space-y-4">

            <div>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                Current Password
              </label>

              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="mt-1.5 w-full h-10 rounded-xl border border-blue-500/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <div>

              <label className="text-xs uppercase tracking-wide text-gray-400">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="mt-1.5 w-full h-10 rounded-xl border border-blue-500/15 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <button
              onClick={handlePasswordUpdate}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm font-medium text-white"
            >
              {savingPassword
                ? "Updating..."
                : "Change Password"}
            </button>

          </div>

        </div>

      </div>
            {/* Logout */}

      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-red-400">
            Logout
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Sign out from this device.
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="
            h-10
            px-6
            rounded-xl
            bg-red-500
            hover:bg-red-400
            text-white
            text-sm
            font-medium
            transition
          "
        >
          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>

      </div>

    </section>
  </>
);
}

export default ProfilePage;