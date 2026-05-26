import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if it's a simulated order
    if (!keyId || !keySecret || razorpay_order_id.startsWith("mock_")) {
      return NextResponse.json({ 
        success: true, 
        message: "Mock Payment validation successful", 
        isMock: true 
      });
    }

    // Standard cryptographic signature check
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully", 
        isMock: false 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Payment signature mismatch. Verification failed." 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error verifying payment signature: ", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
