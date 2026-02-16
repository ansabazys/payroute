import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    const {
      name,
      phone,
      address,
      totalAmount,
      paidAmount,
      nextDueDate,
      location,
    } = body;

    if (!name || !totalAmount || !nextDueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const pendingAmount = totalAmount - (paidAmount || 0);

    const customer = await Customer.create({
      ownerId: session.user.id,
      name,
      phone,
      address,
      totalAmount,
      paidAmount: paidAmount || 0,
      pendingAmount,
      nextDueDate,
      location,
    });

    return NextResponse.json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("CUSTOMER_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log(session)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const customers = await Customer.find({
      ownerId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET_CUSTOMERS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
