import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { ArrowLeft, Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get("/favourites");
      setFavorites(data);
    } catch (err) {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (productId) => {
    setFavorites(favorites.filter((fav) => fav.product.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/shop")} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-rose-600">My Favorites</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Save your favorite items to view them later</p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition">
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              You have <span className="font-semibold">{favorites.length}</span> favorite items
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favorites.map((fav) => (
                <ProductCard
                  key={fav.id}
                  product={fav.product}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
