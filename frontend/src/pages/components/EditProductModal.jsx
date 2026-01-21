import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/modal.css";

function EditProductModal({ isOpen, onClose, productId, onProductUpdated }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [keywords, setKeywords] = useState("");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && productId) {
            fetchProduct();
        }
    }, [isOpen, productId]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
            const data = await res.json();

            setName(data.name);
            setPrice(data.price);
            setDescription(data.description);
            setVideoUrl(data.video_url || "");
            setKeywords(data.keywords || "");
            setPreview(data.image_url);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch product details");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Product name is required");
        if (!price) return toast.error("Price is required");
        if (!description) return toast.error("Description is required");
        if (!keywords) return toast.error("Keywords are required");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("video_url", videoUrl);
        formData.append("keywords", keywords);

        if (image) formData.append("image", image);

        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                toast.success("Product updated successfully!");
                // Reset form
                setName("");
                setPrice("");
                setDescription("");
                setImage(null);
                setVideoUrl("");
                setKeywords("");
                setPreview(null);
                onClose();
                onProductUpdated(); // Refresh product list
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to update product");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error while updating product");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Edit Product</h2>
                <p className="modal-subtitle">Update the details below and save changes.</p>

                {loading ? (
                    <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="modal-form">
                        <label className="input-label">Product Name<span className="required-asterisk">*</span></label>
                        <input
                            type="text"
                            placeholder="Product Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label className="input-label">Price<span className="required-asterisk">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price *"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <label className="input-label">Description<span className="required-asterisk">*</span></label>
                        <textarea
                            placeholder="Short Description *"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label className="input-label">YouTube Video URL</label>
                        <input
                            type="text"
                            placeholder="YouTube Video URL (optional)"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />

                        <label className="input-label">Keywords<span className="required-asterisk">*</span></label>
                        <input
                            type="text"
                            placeholder="Keywords (comma separated)"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />

                        <label className="input-label">Product Image</label>
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                }}
                            />
                        )}

                        <label className="file-input-label">
                            {image ? image.name : "Upload New Image (optional)"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setImage(file);
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </label>

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Product"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditProductModal;
