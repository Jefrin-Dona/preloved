import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER" });
  const [idDoc, setIdDoc] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      if (form.role === "SELLER" && idDoc) {
        const fd = new FormData();
        fd.append("file", idDoc);
        await api.post("/seller/upload-id", fd);
      }
      toast.success("Registered! Please log in.");
      navigate("/login");
    } catch {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-rose-600 mb-2">Join ReWear</h1>
        <p className="text-center text-gray-400 mb-8">Buy or sell preloved goods</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          {/* Role selection */}
          <div className="flex gap-4">
            {["BUYER", "SELLER"].map((r) => (
              <button key={r} type="button"
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition ${
                  form.role === r ? "border-rose-500 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-400"
                }`}
                onClick={() => setForm({ ...form, role: r })}>
                {r === "BUYER" ? "I want to Buy" : "I want to Sell"}
              </button>
            ))}
          </div>

          {/* ID upload for sellers */}
          {form.role === "SELLER" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700 font-semibold mb-2">ID Verification Required</p>
              <p className="text-xs text-amber-600 mb-3">
                Upload a government-issued ID. Our admin will verify it before you can list products.
              </p>
              <input type="file" accept="image/*,.pdf"
                className="text-sm text-gray-600"
                onChange={(e) => setIdDoc(e.target.files[0])} />
            </div>
          )}

          <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}