import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if keys are not configured - fallback to mock sandbox
    if (!keyId || !keySecret) {
      const mockOrder = {
        id: `mock_ord_${Math.random().toString(36).substring(2, 11)}`,
        entity: "order",
        amount: amount * 100, // in paise
        amount_paid: 0,
        amount_due: amount * 100,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        status: "created",
        attempts: 0,
        notes: { mock: "true" },
        created_at: Math.floor(Date.now() / 1000)
      };
      
      return NextResponse.json({ 
        success: true, 
        order: mockOrder, 
        isMock: true, 
        keyId: "rzp_test_mockkeyid123" 
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json({ 
      success: true, 
      order, 
      isMock: false, 
      keyId 
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order: ", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
