// Database initialization script
const { Pool } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  console.log('Connecting to database:', process.env.DATABASE_URL);
  
  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon PostgreSQL
    }
  });
  
  try {
    // Test the connection
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Create clicks table if it doesn't exist
    console.log('Creating clicks table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id SERIAL PRIMARY KEY,
        element_id VARCHAR(255) NOT NULL,
        element_type VARCHAR(255) NOT NULL,
        page_url VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Clicks table created or already exists');
    
    // Create user_roles table if it doesn't exist
    console.log('Creating user_roles table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('User_roles table created or already exists');
    
    // Insert a test record to verify everything works
    console.log('Inserting test record...');
    await pool.query(
      'INSERT INTO clicks (element_id, element_type, page_url) VALUES ($1, $2, $3) RETURNING id',
      ['test-button', 'test', 'http://localhost:3775/test']
    );
    console.log('Test record inserted successfully');
    
    // Verify the test record
    console.log('Verifying test record...');
    const result = await pool.query(
      'SELECT * FROM clicks WHERE element_id = $1 AND element_type = $2',
      ['test-button', 'test']
    );
    console.log('Test record verified:', result.rows[0]);
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed');
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
