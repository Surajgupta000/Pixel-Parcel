import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { products as defaultProducts } from "@/data/products";

export const dynamic = "force-dynamic";

// Resolve path to the database file: src/data/products.json
const dbFilePath = path.join(process.cwd(), "src", "data", "products.json");

export async function GET() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      // Initialize file with defaultProducts
      // Ensure the directory exists
      const dir = path.dirname(dbFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultProducts, null, 2), "utf-8");
      return NextResponse.json(defaultProducts);
    }

    const fileContent = fs.readFileSync(dbFilePath, "utf-8");
    const products = JSON.parse(fileContent);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API error reading products:", error);
    // If anything fails, fallback to the default static list
    return NextResponse.json(defaultProducts);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array of products." }, { status: 400 });
    }

    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dbFilePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, count: body.length });
  } catch (error: any) {
    console.error("API error writing products:", error);
    return NextResponse.json({ error: error.message || "Failed to write products to database." }, { status: 500 });
  }
}
