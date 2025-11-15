import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import "../styles/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        // Only include products that are not disabled
        const activeProducts = data.filter((product) => !product.is_disabled);

        setProducts(activeProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };


    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisable = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/disable`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to disable product");
      }

      alert("✅ Product disabled successfully!");

      // Refresh the product list
      const updated = await fetch(`${API_URL}/api/products`);
      const data = await updated.json();
      const activeProducts = data.filter((product) => !product.is_disabled);
      setProducts(activeProducts);
      
    } catch (error) {
      console.error("Error disabling product:", error);
      alert("❌ Failed to disable product. Try again.");
    }
  };


  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-header">
        <h2>Product List</h2>
        {user.role === "admin" && <button className="add-btn" onClick={() => navigate("/add-product")}>Add Product</button>}
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={user.role === "admin"} 
              onDelete={handleDelete} 
              onDisable={handleDisable}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
