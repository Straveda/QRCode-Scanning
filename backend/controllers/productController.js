import { pool } from "../config/db.js";
import { generateQRCode } from "../utils/qrGenerator.js";

// Add product (with image upload)
export const addProduct = async (req, res) => {
  console.log("Adding product - Body:", req.body);
  try {
    const { 
      name, 
      price, 
      description, 
      video_url = "", 
      keywords = "", 
      description_type = "paragraph", 
      dose, 
      composition, 
      specifications 
    } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Image file required" });

    // Cloudinary automatically gives full URL
    const image_url = file.path; 

    // Helper to ensure JSON fields are strings for Postgres
    const ensureString = (val) => {
      if (val === undefined || val === null || val === '') return '[]';
      if (typeof val === 'string') {
        // If it's already a JSON string, return it, otherwise stringify it
        try { JSON.parse(val); return val; } catch (e) { return JSON.stringify(val); }
      }
      return JSON.stringify(val);
    };

    // Insert product first (QR after ID is known)
    const result = await pool.query(
      "INSERT INTO products (name, price, description, image_url, video_url, keywords, description_type, dose, composition, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
      [
        name, 
        price, 
        description, 
        image_url, 
        video_url, 
        keywords, 
        description_type || "paragraph", 
        ensureString(dose), 
        ensureString(composition), 
        ensureString(specifications)
      ]
    );

    const productId = result.rows[0].id;
    const qr_code_url = await generateQRCode(productId);

    await pool.query("UPDATE products SET qr_code_url=$1 WHERE id=$2", [qr_code_url, productId]);

    res.status(201).json({ message: "Product added successfully", productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// Get all active products
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const editProduct = async (req, res) => {
  console.log("Editing product - Body:", req.body);
  try {
    const { id } = req.params;
    const { 
      name, 
      price, 
      description, 
      video_url = "", 
      keywords = "", 
      description_type = "paragraph", 
      dose, 
      composition, 
      specifications 
    } = req.body;
    let image_url;

    const ensureString = (val) => {
      if (val === undefined || val === null || val === '') return '[]';
      if (typeof val === 'string') {
        try { JSON.parse(val); return val; } catch (e) { return JSON.stringify(val); }
      }
      return JSON.stringify(val);
    };

    const finalDose = ensureString(dose);
    const finalComposition = ensureString(composition);
    const finalSpecifications = ensureString(specifications);

    if (req.file) {
      image_url = req.file.path;
      await pool.query(
        "UPDATE products SET name=$1, price=$2, description=$3, image_url=$4, video_url=$5, keywords=$6, description_type=$7, dose=$8, composition=$9, specifications=$10 WHERE id=$11",
        [name, price, description, image_url, video_url, keywords, description_type || "paragraph", finalDose, finalComposition, finalSpecifications, id]
      );
    } else {
      await pool.query(
        "UPDATE products SET name=$1, price=$2, description=$3, video_url=$4, keywords=$5, description_type=$6, dose=$7, composition=$8, specifications=$9 WHERE id=$10",
        [name, price, description, video_url, keywords, description_type || "paragraph", finalDose, finalComposition, finalSpecifications, id]
      );
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Disable product
export const disableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE products SET is_disabled=TRUE WHERE id=$1", [id]);
    res.json({ message: "Product disabled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to disable product" });
  }
};

// Enable product
export const enableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE products SET is_disabled=FALSE WHERE id=$1", [id]);
    res.json({ message: "Product enabled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to enable product" });
  }
};