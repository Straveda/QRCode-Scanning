import { useState, useLayoutEffect, useRef } from "react";
import "../../styles/dashboard.css"; // Reuse existing modal styles

function QRModal({ isOpen, onClose, product, originRect }) {
    const [isClosing, setIsClosing] = useState(false);
    const modalContentRef = useRef(null);

    // This state controls when the "open" animation class is added
    const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);

    useLayoutEffect(() => {
        if (isOpen && originRect && modalContentRef.current) {
            const modalRect = modalContentRef.current.getBoundingClientRect();

            // Calculate center position (where modal normally sits)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const modalCenterX = modalRect.left + modalRect.width / 2;
            const modalCenterY = modalRect.top + modalRect.height / 2;

            // Difference between origin center and modal center
            const originCenterX = originRect.left + originRect.width / 2;
            const originCenterY = originRect.top + originRect.height / 2;

            const deltaX = originCenterX - modalCenterX;
            const deltaY = originCenterY - modalCenterY;

            // Scale factors
            const scaleX = originRect.width / modalRect.width;
            const scaleY = originRect.height / modalRect.height;
            // Use the smaller scale to keep aspect ratio somewhat consistent or just use 0.1 for a "pop" effect
            // A simple pop effect from the button center is often cleaner than full morph
            // Let's try morphing slightly but mostly expanding

            // Set CSS variables for the starting position
            const content = modalContentRef.current;
            content.style.setProperty("--start-x", `${deltaX}px`);
            content.style.setProperty("--start-y", `${deltaY}px`);
            content.style.setProperty("--start-scale-x", Math.max(scaleX, 0.1).toString());
            content.style.setProperty("--start-scale-y", Math.max(scaleY, 0.1).toString());

            // Trigger animation in next frame
            requestAnimationFrame(() => {
                setIsAnimatingOpen(true);
            });
        }
    }, [isOpen, originRect]);

    if (!isOpen || !product) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsAnimatingOpen(false); // Reset
            onClose();
        }, 300);
    };

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
            navigator.clipboard.writeText(shareUrl);
            alert("Share unsupported. Product link copied to clipboard!");
        }
    };

    return (
        <div className={`qr-modal ${isClosing ? "closing" : ""}`} onClick={handleClose}>
            <div
                ref={modalContentRef}
                className={`qr-modal-content ${isAnimatingOpen && !isClosing ? "animate-open" : ""} ${isClosing ? "closing-animation" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <img src={product.qr_code_url} alt="QR Code" className="qr-image" />

                <div className="qr-actions">
                    <button onClick={handleDownload}>Download</button>
                    <button onClick={handlePrint}>Print</button>
                    <button onClick={handleShare}>Share</button>
                </div>

                <button className="back-btn" onClick={handleClose}>Back</button>
            </div>
        </div>
    );
}

export default QRModal;
