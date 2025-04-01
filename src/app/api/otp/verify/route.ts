import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = process.env.TWILIO_VERIFY_SID!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ success: false, message: "Phone and code required" }, { status: 400 });
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: `+91${phone}`,
      code,
    });

    if (verificationCheck.status === "approved") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
