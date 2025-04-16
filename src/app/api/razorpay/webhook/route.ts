// src/app/api/razorpay/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // handle webhook logic here
  return NextResponse.json({ success: true });
}
