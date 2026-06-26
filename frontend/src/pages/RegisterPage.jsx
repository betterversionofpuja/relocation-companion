import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser(formData);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-16 bg-[#050816]" />

      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-6">

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Save your comparisons and access them anytime.
          </p>

          <div className="mt-6 space-y-4">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-blue-500/15 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-blue-500/15 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-blue-500/15 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-blue-500/15 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            />

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium text-white disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Log In
              </Link>
            </p>

          </div>

        </div>
      </section>
    </>
  );
}

export default RegisterPage;