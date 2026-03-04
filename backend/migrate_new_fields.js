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

        console.log("⏳ Adding dose, composition, and specifications columns to products table...");
        await client.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS dose JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS composition JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]';
        `);
        console.log("✅ Columns added successfully");

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        await client.end();
    }
}

migrate();
