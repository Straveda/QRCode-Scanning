import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/modal.css";

function EditProductModal({ isOpen, onClose, productId, onProductUpdated }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionType, setDescriptionType] = useState("paragraph");
    const [image, setImage] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [keywords, setKeywords] = useState("");
    const [doses, setDoses] = useState([{ crops: "", dose: "" }]);
    const [compositions, setCompositions] = useState([{ ingredients: "", content: "" }]);
    const [specifications, setSpecifications] = useState([{ parameters: "", value: "" }]);
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
            setDescriptionType(data.description_type || "paragraph");
            setVideoUrl(data.video_url || "");
            setKeywords(data.keywords || "");
            setDoses(data.dose && data.dose.length > 0 ? data.dose : [{ crops: "", dose: "" }]);
            setCompositions(data.composition && data.composition.length > 0 ? data.composition : [{ ingredients: "", content: "" }]);
            setSpecifications(data.specifications && data.specifications.length > 0 ? data.specifications : [{ parameters: "", value: "" }]);
            setPreview(data.image_url);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch product details");
            setLoading(false);
        }
    };

    const addDoseRow = () => setDoses([...doses, { crops: "", dose: "" }]);
    const removeDoseRow = (index) => setDoses(doses.filter((_, i) => i !== index));

    const addCompositionRow = () => setCompositions([...compositions, { ingredients: "", content: "" }]);
    const removeCompositionRow = (index) => setCompositions(compositions.filter((_, i) => i !== index));

    const addSpecificationRow = () => setSpecifications([...specifications, { parameters: "", value: "" }]);
    const removeSpecificationRow = (index) => setSpecifications(specifications.filter((_, i) => i !== index));

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
        formData.append("description_type", descriptionType);
        formData.append("video_url", videoUrl);
        formData.append("keywords", keywords);
        formData.append("dose", JSON.stringify(doses));
        formData.append("composition", JSON.stringify(compositions));
        formData.append("specifications", JSON.stringify(specifications));

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
                setDescriptionType("paragraph");
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
                        <div className="description-type-selector">
                            <label className={`type-option ${descriptionType === "paragraph" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="descriptionType"
                                    value="paragraph"
                                    checked={descriptionType === "paragraph"}
                                    onChange={(e) => setDescriptionType(e.target.value)}
                                />
                                Paragraph
                            </label>
                            <label className={`type-option ${descriptionType === "points" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="descriptionType"
                                    value="points"
                                    checked={descriptionType === "points"}
                                    onChange={(e) => setDescriptionType(e.target.value)}
                                />
                                Points
                            </label>
                        </div>
                        <textarea
                            placeholder={descriptionType === "paragraph" ? "Long Description *" : "Enter points separated by new lines *"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ textAlign: descriptionType === "paragraph" ? "justify" : "left" }}
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

                        {/* Dose Section */}
                        <div className="dynamic-section">
                            <div className="section-header">
                                <label className="input-label">8. Dose:</label>
                                <button type="button" className="add-row-btn" onClick={addDoseRow}>+ Add Row</button>
                            </div>
                            <table className="dynamic-table">
                                <thead>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Crops</th>
                                        <th>Dose</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doses.map((row, index) => (
                                        <tr key={index}>
                                            <td>({index + 1})</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.crops}
                                                    onChange={(e) => {
                                                        const newDoses = [...doses];
                                                        newDoses[index].crops = e.target.value;
                                                        setDoses(newDoses);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.dose}
                                                    onChange={(e) => {
                                                        const newDoses = [...doses];
                                                        newDoses[index].dose = e.target.value;
                                                        setDoses(newDoses);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" className="remove-row-btn" onClick={() => removeDoseRow(index)}>×</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Composition Section */}
                        <div className="dynamic-section">
                            <div className="section-header">
                                <label className="input-label">5. Composition:</label>
                                <button type="button" className="add-row-btn" onClick={addCompositionRow}>+ Add Row</button>
                            </div>
                            <table className="dynamic-table">
                                <thead>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Ingredients</th>
                                        <th>Content</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compositions.map((row, index) => (
                                        <tr key={index}>
                                            <td>({index + 1})</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.ingredients}
                                                    onChange={(e) => {
                                                        const newComp = [...compositions];
                                                        newComp[index].ingredients = e.target.value;
                                                        setCompositions(newComp);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.content}
                                                    onChange={(e) => {
                                                        const newComp = [...compositions];
                                                        newComp[index].content = e.target.value;
                                                        setCompositions(newComp);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" className="remove-row-btn" onClick={() => removeCompositionRow(index)}>×</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Specifications Section */}
                        <div className="dynamic-section">
                            <div className="section-header">
                                <label className="input-label">6. Specifications:</label>
                                <button type="button" className="add-row-btn" onClick={addSpecificationRow}>+ Add Row</button>
                            </div>
                            <table className="dynamic-table">
                                <thead>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Parameters</th>
                                        <th>Value</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specifications.map((row, index) => (
                                        <tr key={index}>
                                            <td>({index + 1})</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.parameters}
                                                    onChange={(e) => {
                                                        const newSpecs = [...specifications];
                                                        newSpecs[index].parameters = e.target.value;
                                                        setSpecifications(newSpecs);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.value}
                                                    onChange={(e) => {
                                                        const newSpecs = [...specifications];
                                                        newSpecs[index].value = e.target.value;
                                                        setSpecifications(newSpecs);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" className="remove-row-btn" onClick={() => removeSpecificationRow(index)}>×</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
