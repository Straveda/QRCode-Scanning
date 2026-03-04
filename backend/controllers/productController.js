import { pool } from "../config/db.js";
import { generateQRCode } from "../utils/qrGenerator.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload buffer to Cloudinary
async function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "straveda_products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Add product (with image upload)
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, description_type, video_url, keywords, dose, composition, specifications } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Image file required" });

    // Upload buffer to Cloudinary manually
    const uploadResult = await uploadToCloudinary(file.buffer, file.mimetype);
    const image_url = uploadResult.secure_url;

    // Parse JSONB fields if they are strings (from FormData)
    const doseData = dose ? JSON.parse(dose) : [];
    const compositionData = composition ? JSON.parse(composition) : [];
    const specificationsData = specifications ? JSON.parse(specifications) : [];

    // Insert product first (QR after ID is known)
    const result = await pool.query(
      "INSERT INTO products (name, price, description, description_type, image_url, video_url, keywords, dose, composition, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
      [name, price, description, description_type, image_url, video_url, keywords, JSON.stringify(doseData), JSON.stringify(compositionData), JSON.stringify(specificationsData)]
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

// Edit product (optionally replace image)
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, description_type, video_url, keywords, dose, composition, specifications } = req.body;

    const doseData = dose ? JSON.parse(dose) : [];
    const compositionData = composition ? JSON.parse(composition) : [];
    const specificationsData = specifications ? JSON.parse(specifications) : [];

    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      const image_url = uploadResult.secure_url;
      await pool.query(
        "UPDATE products SET name=$1, price=$2, description=$3, description_type=$4, image_url=$5, video_url=$6, keywords=$7, dose=$8, composition=$9, specifications=$10 WHERE id=$11",
        [name, price, description, description_type, image_url, video_url, keywords, JSON.stringify(doseData), JSON.stringify(compositionData), JSON.stringify(specificationsData), id]
      );
    } else {
      await pool.query(
        "UPDATE products SET name=$1, price=$2, description=$3, description_type=$4, video_url=$5, keywords=$6, dose=$7, composition=$8, specifications=$9 WHERE id=$10",
        [name, price, description, description_type, video_url, keywords, JSON.stringify(doseData), JSON.stringify(compositionData), JSON.stringify(specificationsData), id]
      );
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
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