import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Package, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Clothing", condition: "GOOD" });
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get("/products/seller/mine").then(({ data }) => setProducts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
    images.forEach((img) => fd.append("images", img));
    try {
      const { data } = await api.post("/products/seller/add", fd);
      setProducts([data, ...products]);
      setShowForm(false);
      toast.success("Product listed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-medium transition">
          <Plus size={18} /> List New Item
        </button>
      </div>

      {/* List product form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700">New Listing</h2>
          <input className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            placeholder="Describe the item clearly — condition, brand, dimensions..."
            rows={4} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Price ($)"
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Clothing", "Electronics", "Books", "Furniture", "Toys", "Sports"].map((c) =>
                <option key={c}>{c}</option>)}
            </select>
            <select className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
              value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-rose-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Upload clear, well-lit images (multiple recommended)</p>
            <input type="file" multiple accept="image/*"
              onChange={(e) => setImages([...e.target.files])} />
          </div>
          <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition">
            Publish Listing
          </button>
        </form>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img src={p.imageUrls?.[0] || "/placeholder.jpg"} alt={p.title}
              className="w-full aspect-square object-cover" />
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{p.title}</p>
              <p className="text-rose-600 font-bold">${p.price}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                p.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                p.status === "SOLD" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
              }`}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}