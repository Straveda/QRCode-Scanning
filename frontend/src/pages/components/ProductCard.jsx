import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, isAdmin, onDelete, onDisable }) {
  const [showQR, setShowQR] = useState(false);

  const handleShowQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  const navigate = useNavigate();

  const imagePath = product.image_url;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = product.qr_code_url;
    link.download = `QR_${product.id}.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align: center;">
          <img src="${product.qr_code_url}" style="width:300px; margin-top:20px;" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin + `/product/${product.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "View Product",
          text: "Scan or open this link to view the product",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(shareUrl);
      alert("Share unsupported. Product link copied to clipboard!");
    }
  };



  return (
    <div className="product-card">
      <img src={imagePath} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {product.video_url && (
        <a href={product.video_url} target="_blank" rel="noopener noreferrer">
          Watch Tutorial
        </a>
      )}

      {product.keywords && (
        <p>Keywords: {product.keywords}</p>
      )}

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

              {/* Action Buttons */}
              <div className="qr-actions">
                <button onClick={handleDownload}>Download</button>
                <button onClick={handlePrint}>Print</button>
                <button onClick={handleShare}>Share</button>
              </div>

              <button className="close-btn" onClick={handleCloseQR}>Close</button>
            </div>
          </div>
        )}

    </div>
  );
}

export default ProductCard;
