import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { btn, card, input, label as labelClass, link } from "../lib/ui";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center py-6">
      <form onSubmit={handleSubmit} className={card("w-full max-w-sm p-7 space-y-5")}>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Create an account
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass()}>Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className={input("mt-1")}
          />
        </div>

        <button type="submit" disabled={submitting} className={btn("primary", "lg", "w-full")}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className={link()}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
