import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Heart, ShoppingCart, ArrowLeft, Star, MapPin, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", flagFalseDescription: false });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSeller(data.seller);

        // Fetch reviews
        const reviewsData = await api.get(`/reviews/seller/${data.seller.id}`);
        setReviews(reviewsData.data);
      } catch (err) {
        toast.error("Product not found");
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await api.post(`/cart/${product.id}`);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favourites/${product.id}`);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favourites/${product.id}`);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error("Error updating favorites");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (product?.seller?.id === seller?.id) {
      toast.error("You cannot review your own products");
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/reviews/seller/${seller.id}`, {
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment,
        falseDescriptionFlag: newReview.flagFalseDescription,
      });
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: "", flagFalseDescription: false });
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const falseDescriptionCount = reviews.filter((r) => r.falseDescriptionFlag).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/shop")} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-rose-600">Looply</h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
              <img
                src={product.imageUrls?.[0] || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm cursor-pointer hover:ring-2 hover:ring-rose-400">
                    <img src={url} alt={`Product ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-semibold text-gray-600">{product.category}</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">{product.condition}</span>
                {product.status !== "AVAILABLE" && (
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">{product.status}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-6">
              <p className="text-5xl font-bold text-rose-600">${product.price}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Seller Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-semibold text-gray-900">{seller?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
                {!seller?.idVerified && (
                  <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">⚠️ ID not verified</p>
                )}
                {falseDescriptionCount >= 3 && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">🚨 Seller flagged for false descriptions</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {product.status === "AVAILABLE" && (
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-4 font-semibold transition">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className={`px-6 py-4 rounded-xl font-semibold transition ${
                    isFavorite
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

          {/* Review Stats */}
          <div className="mb-8 pb-8 border-b">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-rose-600">{avgRating}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{reviews.length} reviews</p>
              </div>
            </div>
          </div>

          {/* Leave a Review */}
          <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b space-y-4">
            <h3 className="font-semibold text-gray-900">Share Your Experience</h3>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="transition">
                    <Star
                      size={24}
                      className={
                        star <= newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share details about the product quality, condition, and shipping..."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                rows={4}
              />
            </div>

            {/* False Description Flag */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newReview.flagFalseDescription}
                onChange={(e) => setNewReview({ ...newReview, flagFalseDescription: e.target.checked })}
                className="w-4 h-4 rounded accent-rose-500"
              />
              <span className="text-sm text-gray-700">
                ⚠️ Product description does not match
              </span>
            </label>

            <button
              type="submit"
              disabled={submittingReview || !newReview.comment.trim()}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg py-3 font-semibold transition">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.reviewer?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                    {review.falseDescriptionFlag && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                        🚩 Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-3">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
