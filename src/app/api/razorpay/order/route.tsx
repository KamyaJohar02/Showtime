import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const { amount, name, email, phone } = await req.json();
  if (!amount || !name || !email || !phone) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });

  const options = {
    amount: amount, // convert ₹ to paise
 // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    payment_capture: 1,
    notes: {
      name,
      email,
      phone,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
