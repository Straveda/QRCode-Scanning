import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await client.connect();
        console.log("✅ Connected to database");

        console.log("⏳ Adding description_type column to products table...");
        await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS description_type TEXT DEFAULT 'paragraph';
    `);
        console.log("✅ Column added successfully");

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        await client.end();
    }
}

migrate();
