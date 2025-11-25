import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/addproduct.css"; // reuse same styling

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
        setVideoUrl(data.video_url);
        setKeywords(data.keywords);
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

    if (image) formData.append("image", image); // optional new image

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

  if (!product) return <p>Loading...</p>;

  return (
    <div className="add-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          placeholder="Name"
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
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {preview && <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: "8px" }} />}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file)); // generates live preview
          }}
        />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
