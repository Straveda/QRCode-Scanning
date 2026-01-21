import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AddProductModal from "./components/AddProductModal";
import EditProductModal from "./components/EditProductModal";
import ConfirmDialog from "./components/ConfirmDialog";
import SearchInput from "./components/SearchInput";
import QRModal from "./components/QRModal";
import "../styles/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null); // { product, originRect }

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    setProductToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleEdit = (id) => {
    setEditProductId(id);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productToDelete));
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting product");
    } finally {
      setShowConfirmDialog(false);
      setProductToDelete(null);
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

      toast.success("Product disabled successfully!");

      // Refresh the product list
      fetchProducts();

    } catch (error) {
      console.error("Error disabling product:", error);
      toast.error("Failed to disable product. Try again.");
    }
  };


  if (!user) return <p>Loading...</p>;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-header">
        <h2>Product List</h2>
        {user.role === "admin" && (
          <div className="header-buttons">
            <SearchInput onSearch={setSearchQuery} onSearching={setIsSearching} />
            <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Product</button>
            <button className="disabled-btn" onClick={() => navigate("/disabled-products")}>View Disabled Products</button>
          </div>
        )}
      </div>

      <div className="product-grid">
        {isSearching ? (
          <div className="loader-container" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
            <div className="spinner" style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={user.role === "admin"}
              onDelete={handleDelete}
              onDisable={handleDisable}
              onEdit={handleEdit}
              onShowQR={(product, rect) => setSelectedQR({ product, originRect: rect })}
            />
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", width: "100%" }}>No products available.</p>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={fetchProducts}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        productId={editProductId}
        onClose={() => {
          setShowEditModal(false);
          setEditProductId(null);
        }}
        onProductUpdated={fetchProducts}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmDialog(false);
          setProductToDelete(null);
        }}
      />

      {/* QR Code Modal */}
      <QRModal
        isOpen={!!selectedQR}
        product={selectedQR?.product}
        originRect={selectedQR?.originRect}
        onClose={() => setSelectedQR(null)}
      />
    </div>
  );
}

export default Dashboard;
