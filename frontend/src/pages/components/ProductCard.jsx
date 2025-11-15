import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, isAdmin, onDelete, onDisable }) {
  const [showQR, setShowQR] = useState(false);

  const handleShowQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  const navigate = useNavigate();

  const imagePath = product.image_url;

  return (
    <div className="product-card">
      <img src={imagePath} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      <div className="button-group">
        <button className="qr-btn" onClick={handleShowQR}>
          Show QR Code
        </button>

        {isAdmin && (
          <>
            <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</button>
            <button className="disable-btn" onClick={() => onDisable && onDisable(product.id)}>Disable</button>
            <button className="delete-btn" onClick={() => onDelete && onDelete(product.id)}>Delete</button>
          </>
        )}
      </div>

      {showQR && (
        <div className="qr-modal" onClick={handleCloseQR}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={product.qr_code_url} alt="QR Code" className="qr-image" />
            <button className="close-btn" onClick={handleCloseQR}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
