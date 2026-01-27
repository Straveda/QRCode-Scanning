import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, isAdmin, onDelete, onDisable, onEnable, isDisabled, onEdit, onShowQR }) {

  const navigate = useNavigate();

  const imagePath = product.image_url;





  return (
    <div className="product-card">
      <img src={imagePath} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>₹ {product.price}</p>
      {product.video_url && (
        <a href={product.video_url} target="_blank" rel="noopener noreferrer">
          Watch Tutorial
        </a>
      )}

      {/* {product.keywords && (
          <p>Keywords: {product.keywords}</p>
      )} */}

      <div className="button-group">
        <button className="qr-btn" onClick={(e) => onShowQR && onShowQR(product, e.currentTarget.getBoundingClientRect())}>
          Show QR Code
        </button>
        {isAdmin && (
          <button className="edit-btn" onClick={() => onEdit && onEdit(product.id)}>Edit</button>
        )}

        {isAdmin && (
          <>
            {isDisabled ? (
              <button className="enable-btn" onClick={() => onEnable && onEnable(product.id)}>Enable</button>
            ) : (
              <button className="disable-btn" onClick={() => onDisable && onDisable(product.id)}>Disable</button>
            )}
            <button className="delete-btn" onClick={() => onDelete && onDelete(product.id)}>Delete</button>
          </>
        )}
      </div>



    </div>
  );
}

export default ProductCard;
