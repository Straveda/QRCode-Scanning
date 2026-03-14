import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/productDetails.css";
import logo from "../assets/logo.jpeg";

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
        <img src={logo} alt="SMIDI Logo" className="pdp-logo" />
      </div>

      <div className="pdp-container">
        <p className="pdp-page-title">Product Details</p>

        {/* Product Image Card */}
        <div className="pdp-image-card">
          <img src={product.image_url} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="pdp-info">
          <h2 className="pdp-title">{product.name}</h2>



          <div className="pdp-description-section">
            <h3 className="section-label">Description</h3>
            <div className={`pdp-description-text ${product.description_type === 'points' ? 'pdp-description-points' : 'pdp-description-paragraph'}`}>
              {product.description_type === 'points' ? (
                <ul>
                  {product.description.split('\n').filter(p => p.trim()).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              ) : (
                product.description
              )}
            </div>
          </div>

          {/* Dose Table */}
          {product.dose && product.dose.length > 0 && product.dose.some(d => d.crops || d.dose) && (
            <div className="pdp-details-section">
              <h3 className="section-label">Dose</h3>
              <table className="pdp-details-table">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Crops</th>
                    <th>Dose</th>
                  </tr>
                </thead>
                <tbody>
                  {product.dose.map((item, index) => (
                    <tr key={index}>
                      <td>({index + 1})</td>
                      <td>{item.crops}</td>
                      <td>{item.dose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Composition Table */}
          {product.composition && product.composition.length > 0 && product.composition.some(c => c.ingredients || c.content) && (
            <div className="pdp-details-section">
              <h3 className="section-label">Composition</h3>
              <table className="pdp-details-table">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Ingredients</th>
                    <th>Content</th>
                  </tr>
                </thead>
                <tbody>
                  {product.composition.map((item, index) => (
                    <tr key={index}>
                      <td>({index + 1})</td>
                      <td>{item.ingredients}</td>
                      <td>{item.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && product.specifications.some(s => s.parameters || s.value) && (
            <div className="pdp-details-section">
              <h3 className="section-label">Specifications</h3>
              <table className="pdp-details-table">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Parameters</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.specifications.map((item, index) => (
                    <tr key={index}>
                      <td>({index + 1})</td>
                      <td>{item.parameters}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Keywords */}
          {/*{product.keywords && (
            <div className="pdp-keywords-section">
              <strong>Keywords: </strong> {product.keywords}
            </div>*/}
          {/*)}*/}
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
