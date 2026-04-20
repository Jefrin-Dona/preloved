import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [], total = "0" } = location.state || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create orders for each item
      for (const item of items) {
        await api.post("/orders", {
          productId: item.product.id,
          totalAmount: item.product.price,
        });
      }

      // Clear cart
      for (const item of items) {
        await api.delete(`/cart/${item.product.id}`);
      }

      toast.success("Order placed successfully!");
      navigate("/shop");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/cart")} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-rose-600">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Step Indicator */}
              <div className="flex gap-2 mb-8">
                {[1, 2].map((stepNum) => (
                  <div key={stepNum} className={`flex-1 h-2 rounded-full transition ${stepNum <= step ? "bg-rose-500" : "bg-gray-300"}`} />
                ))}
              </div>

              {/* Shipping Information */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-3 font-semibold transition">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Payment Information */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock size={20} />
                    Payment Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, "");
                        if (value.length > 16) value = value.slice(0, 16);
                        value = value.replace(/(\d{4})/g, "$1 ").trim();
                        handleInputChange({ target: { name: "cardNumber", value } });
                      }}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          handleInputChange({ target: { name: "expiryDate", value } });
                        }}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 3) value = value.slice(0, 3);
                          handleInputChange({ target: { name: "cvv", value } });
                        }}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-4">
                    Your payment is secure and encrypted. This is a demo checkout.
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-50 transition">
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg py-3 font-semibold transition">
                      {loading ? "Processing..." : "Complete Purchase"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                    <span className="truncate">{item.product.title}</span>
                    <span className="font-semibold">${item.product.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${(parseFloat(total) * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(parseFloat(total) * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
