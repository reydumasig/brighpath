import { NextRequest, NextResponse } from "next/server";
import {
  getAllTableData,
  getTableData,
  upsertTableData,
  deleteTableData,
} from "@/lib/db";

/**
 * GET /api/raci-tables
 * Get all RACI table data or a specific section
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionId = searchParams.get("sectionId");

    if (sectionId) {
      // Get specific section
      const data = await getTableData(sectionId);
      if (!data) {
        return NextResponse.json({ data: null }, { status: 200 });
      }
      return NextResponse.json({ data }, { status: 200 });
    } else {
      // Get all sections
      const data = await getAllTableData();
      return NextResponse.json({ data }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in GET /api/raci-tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/raci-tables
 * Create or update RACI table data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionId, headers, rows } = body;

    if (!sectionId || !headers || !rows) {
      return NextResponse.json(
        { error: "Missing required fields: sectionId, headers, rows" },
        { status: 400 }
      );
    }

    await upsertTableData(sectionId, headers, rows);

    return NextResponse.json(
      { success: true, message: "Table data updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/raci-tables:", error);
    return NextResponse.json(
      { error: "Failed to update table data" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/raci-tables?sectionId=xxx
 * Delete (reset) RACI table data for a section
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json(
        { error: "Missing sectionId parameter" },
        { status: 400 }
      );
    }

    await deleteTableData(sectionId);

    return NextResponse.json(
      { success: true, message: "Table data reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/raci-tables:", error);
    return NextResponse.json(
      { error: "Failed to reset table data" },
      { status: 500 }
    );
  }
}

