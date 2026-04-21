import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function ShopPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/search?size=50");
        console.log("🔥 API RESPONSE:", data);
        console.log("🔥 PRODUCTS:", data.content);
        setProducts(data.content || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">Looply Store</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Products</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800">No products available</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}