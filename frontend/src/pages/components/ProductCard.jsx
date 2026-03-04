import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, isAdmin, onDelete, onDisable, onEnable, isDisabled, onEdit, onShowQR }) {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const imagePath = product.image_url;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="product-card">
      {/* Kebab menu — top-right corner, admin only */}
      {isAdmin && (
        <div className="kebab-menu" ref={menuRef}>
          <button
            className="kebab-trigger"
            onClick={() => setMenuOpen((prev) => !prev)}
            title="More actions"
            aria-label="More actions"
          >
            &#8942;
          </button>

          {menuOpen && (
            <div className="kebab-dropdown">
              {isDisabled ? (
                <button
                  className="kebab-item kebab-enable"
                  onClick={() => { setMenuOpen(false); onEnable && onEnable(product.id); }}
                >
                  ✅ Enable
                </button>
              ) : (
                <button
                  className="kebab-item kebab-disable"
                  onClick={() => { setMenuOpen(false); onDisable && onDisable(product.id); }}
                >
                  🚫 Disable
                </button>
              )}
              <button
                className="kebab-item kebab-delete"
                onClick={() => { setMenuOpen(false); onDelete && onDelete(product.id); }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}

      <img src={imagePath} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p className="price-tag">₹ {product.price}</p>
      {product.video_url && (
        <a href={product.video_url} target="_blank" rel="noopener noreferrer">
          Watch Tutorial
        </a>
      )}

      <div className="button-group">
        <button className="qr-btn" onClick={(e) => onShowQR && onShowQR(product, e.currentTarget.getBoundingClientRect())}>
          Show QR Code
        </button>
        {isAdmin && (
          <button className="edit-btn" onClick={() => onEdit && onEdit(product.id)}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
