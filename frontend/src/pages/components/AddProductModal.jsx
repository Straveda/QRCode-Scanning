import { useState } from "react";
import { toast } from "react-toastify";
import "../../styles/modal.css";

function AddProductModal({ isOpen, onClose, onProductAdded }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [keywords, setKeywords] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Product Name is required");
        if (!price) return toast.error("Price is required");
        if (!description) return toast.error("Description is required");
        if (!keywords) return toast.error("Keywords are required");
        if (!image) return toast.error("Product Image is required");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", image);
        formData.append("video_url", videoUrl);
        formData.append("keywords", keywords);

        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Product added successfully!");
                // Reset form
                setName("");
                setPrice("");
                setDescription("");
                setImage(null);
                setVideoUrl("");
                setKeywords("");
                onClose();
                onProductAdded(); // Refresh product list
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to add product");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error while adding product");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Add a New Product</h2>
                <p className="modal-subtitle">Fill in the details below to add your product.</p>

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

                    <label className="input-label">Product Image<span className="required-asterisk">*</span></label>
                    <label className="file-input-label">
                        {image ? image.name : "Upload Product Image *"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </label>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
