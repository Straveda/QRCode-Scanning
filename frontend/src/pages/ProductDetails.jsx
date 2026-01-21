import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/productDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="pdp-loading">Loading product details...</p>;

  return (
    <div className="pdp-page">
      {/* Mobile Header */}
      {/* Mobile Header */}
      <div className="pdp-header">
        <h1 className="pdp-header-title">SMIDI Product Portal</h1>
        <p className="pdp-header-subtitle">Product Details</p>
      </div>

      <div className="pdp-container">
        {/* Product Image Card */}
        <div className="pdp-image-card">
          <img src={product.image_url} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="pdp-info">
          <h2 className="pdp-title">{product.name}</h2>

          <div className="pdp-price-row">
            <span className="pdp-price-label">Price</span>
            <span className="pdp-price-value">₹{product.price}</span>
          </div>

          <div className="pdp-description-section">
            <h3 className="section-label">Description</h3>
            <div className="pdp-description-text">
              {product.description}
            </div>
            {product.keywords && (
              <div className="pdp-keywords-section">
                <strong>Keywords: </strong> {product.keywords}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pdp-actions">
          <a href="/" className="pdp-btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Visit website
          </a>

          {product.video_url && (
            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="pdp-btn btn-solid">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Watch tutorial
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
