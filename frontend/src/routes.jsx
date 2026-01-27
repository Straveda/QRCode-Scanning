import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import DisabledProducts from "./pages/DisabledProducts";
import ProtectedRoute from "./pages/components/ProtectedRoute";

function AppRoutes() {
  // Check if user is logged in for initial redirect
  const isLoggedIn = () => {
    return localStorage.getItem("user") !== null;
  };

  return (
    <Routes>
      <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/disabled-products"
        element={
          <ProtectedRoute>
            <DisabledProducts />
          </ProtectedRoute>
        }
      />

      {/* Public / Semi-Public Routes */}
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
