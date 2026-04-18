import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { CheckCircle, Ban, Flag } from "lucide-react";

export default function AdminPanel() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    api.get("/admin/sellers/pending").then(({ data }) => setPending(data));
  }, []);

  const verify = async (id) => {
    await api.post(`/admin/sellers/${id}/verify`);
    setPending(pending.filter((s) => s.id !== id));
    toast.success("Seller verified!");
  };

  const ban = async (id) => {
    await api.post(`/admin/sellers/${id}/ban`);
    toast.success("Seller banned.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Pending ID Verifications</h2>
        {pending.length === 0 && <p className="text-gray-400 text-sm">All clear — no pending verifications.</p>}
        <div className="space-y-3">
          {pending.map((seller) => (
            <div key={seller.id} className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <p className="font-medium">{seller.name}</p>
                <p className="text-sm text-gray-500">{seller.email}</p>
                {seller.idDocumentUrl && (
                  <a href={seller.idDocumentUrl} target="_blank" rel="noreferrer"
                    className="text-rose-500 text-sm hover:underline">View ID Document</a>
                )}
                <p className="text-xs text-red-500 mt-1">
                  {seller.falseReviewCount > 0 && `⚠ ${seller.falseReviewCount} false review(s) flagged`}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => verify(seller.id)}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600">
                  <CheckCircle size={14} /> Verify
                </button>
                <button onClick={() => ban(seller.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">
                  <Ban size={14} /> Ban
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}