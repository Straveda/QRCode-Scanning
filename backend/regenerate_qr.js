import { pool } from "./config/db.js";
import { generateQRCode } from "./utils/qrGenerator.js";

async function regenerateQRCodes() {
    try {
        console.log("🔄 Regenerating QR codes for all products...");

        const result = await pool.query("SELECT id FROM products");
        const products = result.rows;

        for (const product of products) {
            const qr_code_url = await generateQRCode(product.id);
            await pool.query("UPDATE products SET qr_code_url=$1 WHERE id=$2", [qr_code_url, product.id]);
            console.log(`✅ Updated QR code for product ID: ${product.id}`);
        }

        console.log(`🎉 Successfully regenerated ${products.length} QR codes`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error regenerating QR codes:", err);
        process.exit(1);
    }
}

regenerateQRCodes();
