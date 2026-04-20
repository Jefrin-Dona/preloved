import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={token ? "/shop" : "/login"} />} />
        <Route path="*" element={<Navigate to={token ? "/shop" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}