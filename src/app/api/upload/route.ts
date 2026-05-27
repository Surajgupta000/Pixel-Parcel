import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Retrieve credentials from environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dekhjyyly";
    const apiKey = process.env.CLOUDINARY_API_KEY || "276362372441625";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "UKTwwCQSbr2uWi2aYOwJGFuwP5Y";

    if (!apiSecret) {
      return NextResponse.json({ error: "Cloudinary API Secret configuration is missing." }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000).toString();

    // Create signature using SHA-1 (concatenates sorted parameters with api_secret)
    const signatureStr = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    // Construct form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", new Blob([buffer]), file.name);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload." }, { status: 500 });
  }
}
