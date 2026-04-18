import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToCart = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/cart/${product.id}`);
      toast.success("Added to cart!");
    } catch { toast.error("Login to add to cart"); }
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/favourites/${product.id}`);
      toast.success("Saved to favourites!");
    } catch { toast.error("Login to save"); }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrls?.[0] || "/placeholder.jpg"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={addToFavourites}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1.5 hover:bg-rose-50 transition">
          <Heart size={16} className="text-rose-400" />
        </button>
        <span className="absolute top-2 left-2 bg-white/90 text-xs font-semibold text-gray-600 px-2 py-0.5 rounded-full">
          {product.condition}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{product.title}</h3>
        <p className="text-rose-600 font-bold mt-1">${product.price}</p>
        <button
          onClick={addToCart}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl py-2 text-sm font-medium transition">
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}