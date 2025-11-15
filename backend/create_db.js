import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

console.log("Connecting to:", process.env.DATABASE_URL);

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }   // REQUIRED for Render external DB
});

async function setupDB() {
  try {
    await client.connect();
    console.log("✅ Connected to Render Postgres");

    // ------------ DROP TABLES ------------
    console.log("⏳ Dropping old tables...");
    await client.query(`DROP TABLE IF EXISTS products CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    console.log("🗑 Old tables dropped.");

    // ------------ USERS TABLE ------------
    console.log("⏳ Creating users table...");
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ users table created.");

    // Insert admin user
    console.log("⏳ Inserting admin user...");
    await client.query(`
      INSERT INTO users (email, password, role)
      VALUES ('admin@gmail.com', '1234', 'admin');
    `);
    console.log("✅ Admin user inserted.");

    // ------------ PRODUCTS TABLE ------------
    console.log("⏳ Creating products table...");
    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT,
        image_url TEXT,
        qr_code_url TEXT,
        is_disabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ products table created.");

  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    await client.end();
    console.log("🔒 Database setup complete. Connection closed.");
  }
}

setupDB();
