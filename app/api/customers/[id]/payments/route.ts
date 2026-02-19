import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import Customer from "@/models/Customer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;

    // verify customer belongs to this user
    const customer = await Customer.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    // fetch payments
    const payments = await Payment.find({
      customerId: id,
      ownerId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET_PAYMENTS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}