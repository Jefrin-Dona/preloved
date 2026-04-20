import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCartItems(data);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemoving(productId);
    try {
      await api.delete(`/cart/${productId}`);
      setCartItems(cartItems.filter((item) => item.product.id !== productId));
      toast.success("Removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setRemoving(null);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price), 0).toFixed(2);

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/shop")} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-rose-600">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.product.imageUrls?.[0] || "/placeholder.jpg"}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.product.condition}</p>
                      <p className="text-lg font-bold text-rose-600 mt-2">${item.product.price}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      disabled={removing === item.product.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout", { state: { items: cartItems, total: totalPrice } })}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-3 font-semibold transition">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 font-semibold mt-3 hover:bg-gray-50 transition">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
