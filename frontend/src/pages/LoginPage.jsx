import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
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

    const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    setError("Please fill all fields.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await loginUser(formData);

localStorage.setItem("accessToken", response.accessToken);

setUser(response.user);

navigate("/");
  } catch (error) {
    setError(
      error.response?.data?.message ||
      error.message ||
      "Login failed."
    );
  } finally {
    setLoading(false);
  }
};

    return (
        <>
            {/* Top strip to match Compare page */}
            <div className="h-16 bg-[#050816]" />

            <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm rounded-3xl border border-blue-500/15 bg-[#050816]/70 backdrop-blur-xl p-6">

                    <h1 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Log in to access your saved comparisons.
                    </p>

                    <div className="mt-6 space-y-4">

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
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium text-white disabled:opacity-60"
                        >
                            {loading ? "Logging In..." : "Log In"}
                        </button>

                    </div>

                    <p className="mt-5 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300 transition"
                        >
                            Create one
                        </Link>
                    </p>

                </div>
            </section>
        </>
    );
}

export default LoginPage;