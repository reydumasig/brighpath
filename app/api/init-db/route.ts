import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

/**
 * POST /api/init-db
 * Initialize the database schema
 * Run this once after setting up Vercel Postgres
 */
export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json(
      { success: true, message: "Database initialized successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    );
  }
}

