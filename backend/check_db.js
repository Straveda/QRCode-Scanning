import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        await client.connect();
        console.log("✅ Connected to database");

        console.log("⏳ Checking products table columns...");
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'products';
        `);
        console.table(res.rows);

        console.log("⏳ Checking latest product data...");
        const dataRes = await client.query(`
            SELECT id, name, dose, composition, specifications 
            FROM products 
            ORDER BY id DESC 
            LIMIT 1;
        `);
        console.log(JSON.stringify(dataRes.rows[0], null, 2));

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        await client.end();
    }
}

check();
