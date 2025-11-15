import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/productDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-details-page">
      <div className="product-details">
        <div className="product-details-container">
          <div className="product-image">
            <img
              src={`${API_URL}${product.image_url}`}
              alt={product.name}
            />
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">₹{product.price}</p>
            <p className="description">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
