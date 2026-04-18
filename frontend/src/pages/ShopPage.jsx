import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["All", "Clothing", "Electronics", "Books", "Furniture", "Toys", "Sports"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category && category !== "All") params.category = category;
      const { data } = await api.get("/products/search", { params });
      setProducts(data.content || []);
    } catch { /* handle */ }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [keyword, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-rose-600">ReWear</h1>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="w-full border rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Search preloved goods..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button key={c}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                category === c || (c === "All" && !category)
                  ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-rose-50"
              }`}
              onClick={() => setCategory(c === "All" ? "" : c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}