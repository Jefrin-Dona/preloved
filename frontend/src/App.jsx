import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminPanel from "./pages/AdminPanel";

function HomePage() {
  const { role } = useAuthStore();
  if (!role) return <Navigate to="/login" />;
  if (role === "BUYER") return <Navigate to="/shop" />;
  if (role === "SELLER") return <Navigate to="/seller/dashboard" />;
  if (role === "ADMIN") return <Navigate to="/admin" />;
  return <Navigate to="/login" />;
}

function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shop" element={<ProtectedRoute allowedRole="BUYER"><ShopPage /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute allowedRole="SELLER"><SellerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}