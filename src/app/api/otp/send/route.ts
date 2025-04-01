import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = process.env.TWILIO_VERIFY_SID!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ success: false, message: "Phone number required" }, { status: 400 });
  }

  try {
    const verification = await client.verify.v2.services(verifySid).verifications.create({
      to: `+91${phone}`,
      channel: "sms",
    });

    return NextResponse.json({ success: true, sid: verification.sid });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
