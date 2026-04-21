import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-rose-600 mb-2">Join Looply</h1>
        <p className="text-center text-gray-400 mb-8">Browse preloved goods</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-rose-500 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}