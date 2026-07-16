import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, amount, email, name, preference, interval } = body;

    // Strict parameter validation
    if (!token) {
      return NextResponse.json({ error: "Missing tokenization reference" }, { status: 400 });
    }
    if (!amount || typeof amount !== "number" || amount < 500) {
      return NextResponse.json(
        { error: "Invalid donation amount. Minimum is ₦500" },
        { status: 400 },
      );
    }
    if (!email || !name) {
      return NextResponse.json({ error: "Missing donor details" }, { status: 400 });
    }

    // In production, you verify this token/reference directly with the gateway:
    // const res = await fetch(`https://api.paystack.co/transaction/verify/${token}`, {
    //   headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    // });
    // if (!res.ok) throw new Error("Transaction verification failed with gateway");

    return NextResponse.json({
      success: true,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
      metadata: {
        token,
        amount,
        email,
        name,
        preference,
        interval,
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to verify transaction with gateway";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
