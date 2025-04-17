import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');



if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // ← clean now
      }),
    });
  }
  

const auth = getAuth();
const firestore = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    console.log("✅ [custom-token] Received phone:", phone);

    if (!phone || phone.length !== 10) {
      console.warn("⚠️ [custom-token] Invalid phone number received:", phone);
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // 🔍 Search in Firestore users collection for matching phone
    const usersRef = firestore.collection("users");
    const snapshot = await usersRef.where("mobile", "==", phone).limit(1).get();

    if (snapshot.empty) {
      console.warn("⚠️ [custom-token] No user found for phone:", phone);
      return NextResponse.json(
        { error: "No user found with this phone number." },
        { status: 404 }
      );
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    console.log("✅ [custom-token] Found user UID:", userId);

    const customToken = await auth.createCustomToken(userId);

    console.log("🎉 [custom-token] Custom token created");

    return NextResponse.json({ token: customToken });
  } catch (error: any) {
    console.error("❌ [custom-token] Error creating token:", error);

    return NextResponse.json(
      { error: error?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
