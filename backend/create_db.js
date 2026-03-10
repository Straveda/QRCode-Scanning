import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

console.log("Connecting to:", process.env.DATABASE_URL);

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDB() {
  try {
    await client.connect();
    console.log("✅ Connected to Render Postgres");

    // ------------ USERS TABLE ------------
    console.log("⏳ Ensuring users table exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ users table ready.");

    // Insert admin user only if not exists
    console.log("⏳ Checking admin user...");
    const adminCheck = await client.query(
      `SELECT * FROM users WHERE email = 'admin@gmail.com'`
    );

    if (adminCheck.rows.length === 0) {
      console.log("⏳ Inserting admin user...");
      await client.query(`
        INSERT INTO users (email, password, role)
        VALUES ('admin@gmail.com', '1234', 'admin');
      `);
      console.log("✅ Admin user created.");
    } else {
      console.log("⚡ Admin user already exists. Skipping.");
    }

    // ------------ PRODUCTS TABLE ------------
    console.log("⏳ Ensuring products table exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
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
    console.log("✅ products table ready.");

  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    await client.end();
    console.log("🔒 Database setup complete. Connection closed.");
  }
}

setupDB();
