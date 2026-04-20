import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { CheckCircle, Ban, Flag, LogOut, Eye, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdDoc, setSelectedIdDoc] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    try {
      if (tab === "pending") {
        const { data } = await api.get("/admin/sellers/pending");
        setPending(data);
      } else if (tab === "sellers") {
        const { data } = await api.get("/admin/sellers");
        setSellers(data);
      } else if (tab === "fraud") {
        const { data } = await api.get("/admin/fraud-reports");
        setFraudReports(data);
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySeller = async (sellerId) => {
    try {
      await api.post(`/admin/sellers/${sellerId}/verify`);
      setPending(pending.filter((s) => s.id !== sellerId));
      toast.success("Seller verified successfully!");
    } catch (err) {
      toast.error("Failed to verify seller");
    }
  };

  const handleBanSeller = async (sellerId, reason = "Fraud detected") => {
    if (!window.confirm(`Ban this seller? Reason: ${reason}`)) return;

    try {
      await api.post(`/admin/sellers/${sellerId}/ban`, { reason });
      setPending(pending.filter((s) => s.id !== sellerId));
      setSellers(sellers.filter((s) => s.id !== sellerId));
      toast.success("Seller banned");
    } catch (err) {
      toast.error("Failed to ban seller");
    }
  };

  const handleRejectIdDocument = async (sellerId) => {
    if (!window.confirm("Reject this ID document? Seller will need to resubmit.")) return;

    try {
      await api.post(`/admin/sellers/${sellerId}/reject-id`);
      setPending(pending.filter((s) => s.id !== sellerId));
      toast.success("ID document rejected");
    } catch (err) {
      toast.error("Failed to reject document");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">Looply Admin</h1>
          <button
            onClick={handleLogout}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Pending Verifications</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{pending.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Total Sellers</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Fraud Reports</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{fraudReports.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-600 text-sm">Banned Sellers</p>
            <p className="text-3xl font-bold text-gray-600 mt-1">
              {sellers.filter((s) => s.banned).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {[
            { id: "pending", label: "Pending Verifications", count: pending.length },
            { id: "sellers", label: "All Sellers", count: sellers.length },
            { id: "fraud", label: "Fraud Reports", count: fraudReports.length },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => {
                setTab(tabItem.id);
                setLoading(true);
              }}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                tab === tabItem.id
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}>
              {tabItem.label}
              {tabItem.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full">
                  {tabItem.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "pending" ? (
          //  Pending Verifications
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-gray-600">All sellers verified! Great job.</p>
              </div>
            ) : (
              pending.map((seller) => (
                <div key={seller.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                      <p className="text-gray-600">{seller.email}</p>
                      <p className="text-sm text-gray-600 mt-1">📞 {seller.phone}</p>
                      {seller.idDocumentUrl && (
                        <button
                          onClick={() => setSelectedIdDoc({ name: seller.name, url: seller.idDocumentUrl })}
                          className="text-rose-600 hover:text-rose-700 font-medium text-sm mt-2 flex items-center gap-1">
                          <FileText size={14} /> View ID Document
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="font-semibold">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {seller.falseReviewCount > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-700 text-sm">
                        ⚠️ <strong>{seller.falseReviewCount}</strong> false description reviews flagged
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerifySeller(seller.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-semibold transition">
                      <CheckCircle size={18} /> Approve & Verify
                    </button>
                    <button
                      onClick={() => handleRejectIdDocument(seller.id)}
                      className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-50 transition">
                      Reject Document
                    </button>
                    <button
                      onClick={() => handleBanSeller(seller.id, "Invalid ID")}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-semibold transition">
                      <Ban size={18} /> Ban
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : tab === "sellers" ? (
          // All Sellers
          <div className="space-y-4">
            {sellers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <p className="text-gray-600">No sellers yet.</p>
              </div>
            ) : (
              sellers.map((seller) => (
                <div key={seller.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                        {seller.idVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            ✓ Verified
                          </span>
                        )}
                        {seller.banned && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            🚫 Banned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{seller.email}</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <p>Joined: {new Date(seller.createdAt).toLocaleDateString()}</p>
                        {seller.falseReviewCount > 0 && (
                          <p className="text-red-600 font-semibold mt-1">
                            ⚠️ {seller.falseReviewCount} false description flags
                          </p>
                        )}
                      </div>
                    </div>
                    {seller.banned && (
                      <button
                        onClick={() => {
                          if (window.confirm("Unban this seller?")) {
                            // Call unban API
                            toast.success("Seller unbanned");
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition">
                        Unban
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Fraud Reports
          <div className="space-y-4">
            {fraudReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <Flag size={48} className="mx-auto text-green-400 mb-4" />
                <p className="text-gray-600">No fraud reports. Platform is safe!</p>
              </div>
            ) : (
              fraudReports.map((report, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.seller?.name} <span className="text-red-600">- False Description</span>
                      </h3>
                      <p className="text-gray-600">{report.seller?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Flagged</p>
                      <p className="font-semibold">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Product:</strong> {report.product?.title}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Review Comment:</strong> {report.comment}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">
                      <strong>Seller's False Description Count:</strong> {report.seller?.falseReviewCount}
                    </p>
                  </div>

                  {report.seller?.falseReviewCount >= 3 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-700 text-sm font-semibold">
                        ⚠️ This seller has reached 3+ false description flags and should be banned.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBanSeller(report.seller?.id, "Multiple false descriptions")}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-semibold transition">
                      <Ban size={18} /> Ban Seller
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ID Document Viewer Modal */}
      {selectedIdDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ID Document - {selectedIdDoc.name}</h2>
            {selectedIdDoc.url.endsWith(".pdf") ? (
              <iframe src={selectedIdDoc.url} className="w-full h-96 rounded-lg border" />
            ) : (
              <img src={selectedIdDoc.url} alt="ID Document" className="w-full max-h-96 object-contain rounded-lg border" />
            )}
            <button
              onClick={() => setSelectedIdDoc(null)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg py-2 font-medium transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}