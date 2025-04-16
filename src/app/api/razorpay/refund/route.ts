import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ success: false, message: "Missing payment ID" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const refund = await razorpay.payments.refund(paymentId, {});


    return NextResponse.json({ success: true, refund });
  } catch (error: any) {
    console.error("Refund Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
