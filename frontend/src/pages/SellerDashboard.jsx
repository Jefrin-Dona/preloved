import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Plus, Package, Star, Upload, LogOut, ShoppingCart, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showIdVerification, setShowIdVerification] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Clothing", condition: "LIKE_NEW" });
  const [images, setImages] = useState([]);
  const [idDocument, setIdDocument] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchSellerData();
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await api.get("/seller/verification-status");
      setSeller({
        idVerified: response.data.idVerified,
        email: response.data.email,
      });
      console.log("✅ Verification Status Loaded:", response.data);
    } catch (err) {
      console.error("❌ Failed to fetch verification status:", err);
      // If not verified, assume false
      setSeller({ idVerified: false });
    }
  };

  const fetchSellerData = async () => {
    try {
      const productsData = await api.get("/products/seller/mine");
      console.log("📦 API Response - Products:", productsData.data);
      if (productsData.data.length > 0) {
        console.log("🖼️ First Product Full Details:", JSON.stringify(productsData.data[0], null, 2));
      }
      setProducts(productsData.data);
      // Fetch seller info from profile endpoint if available
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || images.length === 0) {
      toast.error("Please fill all fields and upload at least one image");
      return;
    }

    setSubmitLoading(true);
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
    images.forEach((img) => fd.append("images", img));

    try {
      const { data } = await api.post("/products/seller/add", fd);
      setProducts([data, ...products]);
      setShowForm(false);
      setForm({ title: "", description: "", price: "", category: "Clothing", condition: "LIKE_NEW" });
      setImages([]);
      toast.success("Product listed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list product");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeleting(productId);
    try {
      await api.delete(`/products/seller/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Product removed");
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadId = async (e) => {
    e.preventDefault();
    if (!idDocument) {
      toast.error("Please select a document");
      return;
    }

    setSubmitLoading(true);
    
    try {
      toast.loading("Verifying your ID...", { id: "verify" });
      
      // Call mock verification endpoint
      const response = await api.post("/seller/verify-id-mock");
      
      // Update seller state to verified
      const updatedSeller = { ...seller, idVerified: true };
      setSeller(updatedSeller);
      
      // Persist to localStorage
      localStorage.setItem("sellerData", JSON.stringify(updatedSeller));
      
      // Log successful verification
      console.log("✅ ID Verification Complete", {
        timestamp: new Date().toISOString(),
        document: idDocument.name,
        verified: true,
        seller: updatedSeller,
        serverResponse: response.data
      });
      
      setShowIdVerification(false);
      setIdDocument(null);
      
      toast.dismiss("verify");
      toast.success("ID verified successfully! You can now sell on Looply", { duration: 4 });
    } catch (err) {
      console.error("❌ ID Verification Failed:", err);
      toast.error(err.response?.data?.message || "Failed to verify ID. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">Looply Seller</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ID Verification Banner */}
        {!seller?.idVerified && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <p className="text-yellow-800 mb-3">
              ⚠️ <strong>ID Verification Required</strong> - Verify your identity to continue selling
            </p>
            <button
              onClick={() => setShowIdVerification(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition">
              Upload ID Document
            </button>
          </div>
        )}

        {/* Ban Status */}
        {seller?.banned && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <p className="text-red-800">
              🚫 <strong>Account Banned</strong> - Your account has been suspended due to multiple fraud reports.
            </p>
          </div>
        )}

        {/* ID Verification Modal */}
        {showIdVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ID Verification</h2>
              <p className="text-gray-600 mb-4">
                Upload a clear photo of your government-issued ID (passport, driver's license, or national ID)
              </p>
              <form onSubmit={handleUploadId} className="space-y-4">
                <div className="border-2 border-dashed border-rose-200 rounded-xl p-8 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-sm text-rose-600 font-medium">Click to upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {idDocument && (
                    <p className="text-sm text-gray-600 mt-2">{idDocument.name}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIdVerification(false);
                      setIdDocument(null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!idDocument || submitLoading}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg py-2 font-medium transition">
                    {submitLoading ? "Uploading..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Active Listings</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {products.filter((p) => p.status === "AVAILABLE").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Sold Items</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {products.filter((p) => p.status === "SOLD").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Verification</p>
            <p className={`text-3xl font-bold mt-1 ${seller?.idVerified ? "text-green-600" : "text-yellow-600"}`}>
              {seller?.idVerified ? "✓ Verified" : "Pending"}
            </p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition">
            <Plus size={20} /> List New Item
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h2>
            <form onSubmit={handleSubmitProduct} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Vintage Leather Jacket"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={5}
                  placeholder="Describe the item clearly — condition, brand, size, any flaws..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none">
                    {["Clothing", "Electronics", "Books", "Furniture", "Toys", "Sports", "Accessories"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:outline-none">
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
                <div className="border-2 border-dashed border-rose-200 rounded-xl p-8 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-rose-600 font-medium">Click to upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages([...e.target.files])}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Upload multiple clear, well-lit images</p>
                  {images.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">{images.length} image(s) selected</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ title: "", description: "", price: "", category: "Clothing", condition: "LIKE_NEW" });
                    setImages([]);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg py-3 font-semibold transition">
                  {submitLoading ? "Publishing..." : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Listings</h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No products listed yet. Create your first listing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative">
                    <img
                      src={product.imageUrl 
                        ? (product.imageUrl.startsWith('http') 
                            ? product.imageUrl 
                            : `http://localhost:8080${product.imageUrl}`)
                        : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e5e5' width='200' height='200'/%3E%3C/svg%3E`}
                      alt={product.title}
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e5e5' width='200' height='200'/%3E%3C/svg%3E`;
                      }}
                    />
                    <span className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                      product.status === "SOLD" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-rose-600 mb-4">${product.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg py-2 text-sm font-medium transition">
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleting === product.id}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg py-2 text-sm font-medium transition disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}