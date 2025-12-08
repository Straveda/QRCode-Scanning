import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/editproduct.css"; // NEW CSS FILE

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        setName(data.name);
        setPrice(data.price);
        setVideoUrl(data.video_url || "");
        setKeywords(data.keywords || "");
        setDescription(data.description);
        setPreview(data.image_url);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("video_url", videoUrl);
    formData.append("keywords", keywords);

    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <h2 className="title">Edit Product</h2>
        <p className="subtitle">Update the details below and save changes.</p>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="YouTube Video URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <input
            type="text"
            placeholder="Keywords (comma separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          )}

          <label className="file-input-label">
            Upload New Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </label>

          <button type="submit" className="submit-btn">Update Product</button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
