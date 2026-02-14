import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("now_status")
      .select("category, value");

    if (error) {
      console.error("Error fetching now_status:", error);
      return NextResponse.json(
        { error: "Failed to fetch now status" },
        { status: 500 }
      );
    }

    const result: Record<string, string> = {};
    for (const row of data) {
      result[row.category] = row.value;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/now:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
