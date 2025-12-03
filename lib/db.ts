import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});

/**
 * Initialize the database schema for RACI table data
 * Run this once to set up the tables
 */
export async function initializeDatabase() {
  try {
    // Create table to store RACI table data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS raci_tables (
        id SERIAL PRIMARY KEY,
        section_id VARCHAR(255) UNIQUE NOT NULL,
        headers JSONB NOT NULL,
        rows JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_section_id ON raci_tables(section_id);
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

/**
 * Get table data for a specific section
 */
export async function getTableData(sectionId: string) {
  try {
    const result = await pool.query(
      `SELECT headers, rows, updated_at
       FROM raci_tables
       WHERE section_id = $1
       LIMIT 1;`,
      [sectionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      headers: result.rows[0].headers,
      rows: result.rows[0].rows,
      updatedAt: result.rows[0].updated_at,
    };
  } catch (error) {
    console.error("Error getting table data:", error);
    throw error;
  }
}

/**
 * Get all table data
 */
export async function getAllTableData() {
  try {
    const result = await pool.query(`
      SELECT section_id, headers, rows, updated_at
      FROM raci_tables
      ORDER BY section_id;
    `);

    const data: Record<string, { headers: any[]; rows: any[][]; updatedAt: string }> = {};
    
    result.rows.forEach((row) => {
      data[row.section_id] = {
        headers: row.headers,
        rows: row.rows,
        updatedAt: row.updated_at,
      };
    });

    return data;
  } catch (error) {
    console.error("Error getting all table data:", error);
    throw error;
  }
}

/**
 * Upsert table data (insert or update)
 */
export async function upsertTableData(
  sectionId: string,
  headers: string[],
  rows: string[][]
) {
  try {
    await pool.query(
      `INSERT INTO raci_tables (section_id, headers, rows, updated_at)
       VALUES ($1, $2::jsonb, $3::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (section_id)
       DO UPDATE SET
         headers = $2::jsonb,
         rows = $3::jsonb,
         updated_at = CURRENT_TIMESTAMP;`,
      [sectionId, JSON.stringify(headers), JSON.stringify(rows)]
    );

    return { success: true };
  } catch (error) {
    console.error("Error upserting table data:", error);
    throw error;
  }
}

/**
 * Delete table data for a section (reset to original)
 */
export async function deleteTableData(sectionId: string) {
  try {
    await pool.query(
      `DELETE FROM raci_tables
       WHERE section_id = $1;`,
      [sectionId]
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting table data:", error);
    throw error;
  }
}

