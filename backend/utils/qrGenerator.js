import QRCode from "qrcode";

import dotenv from "dotenv";

dotenv.config(); // make sure this is called so process.env works

export const generateQRCode = async (productId) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const productURL = `${FRONTEND_URL}/product/${productId}`;
  const qrDataUrl = await QRCode.toDataURL(productURL);
  return qrDataUrl;
};
