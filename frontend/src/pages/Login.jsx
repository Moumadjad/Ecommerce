import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { btn, card, input, label as labelClass, link } from "../lib/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      const redirect = searchParams.get("redirect");
      navigate(redirect || (user.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center py-6">
      <form onSubmit={handleSubmit} className={card("w-full max-w-sm p-7 space-y-5")}>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Log in
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass()}>Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

        <div>
          <label className={labelClass()}>Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

        <button type="submit" disabled={submitting} className={btn("primary", "lg", "w-full")}>
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/register" className={link()}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
