import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
  disableProduct,
  enableProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), editProduct);
router.delete("/:id", deleteProduct);
router.put("/:id/disable", disableProduct);
router.put("/:id/enable", enableProduct);

export default router;
