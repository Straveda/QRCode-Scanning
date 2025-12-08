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

      {/* Header */}
      <div className="pdp-header">
        <button className="pdp-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="pdp-main-title">Straveda Product Portal</h1>
        <p className="pdp-subtitle">Product Details</p>
      </div>

      {/* Card */}
      <div className="pdp-card">

        <div className="pdp-image-section">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div className="pdp-info-section">
          <h2 className="pdp-product-name">{product.name}</h2>
          <p className="pdp-price">₹{product.price}</p>

          {product.video_url && (
            <a
              href={product.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pdp-tutorial-btn"
            >
              Watch Tutorial
            </a>
          )}

          {product.keywords && (
            <p className="pdp-keywords">
              <strong>Keywords: </strong> {product.keywords}
            </p>
          )}

          <p className="pdp-description">{product.description}</p>
        </div>

      </div>
    </div>
  );
}
