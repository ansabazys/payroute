import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import Payment from "@/models/Payment";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // optional limit
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 20);

    // 1️⃣ Get payments
    const payments = await Payment.find({
      ownerId: session.user.id,
    })
      .sort({ createdAt: -1})
      .limit(limit)
      .lean();

    if (!payments.length) {
      return NextResponse.json([]);
    }

    // 2️⃣ Get related customers
    const customerIds = payments.map((p) => p.customerId);

    const customers = await Customer.find({
      _id: { $in: customerIds },
      ownerId: session.user.id,
    }).lean();

    // 3️⃣ Map customer names
    const customerMap: Record<string, any> = {};
    customers.forEach((c) => {
      customerMap[c._id.toString()] = c;
    });

    const enrichedPayments = payments.map((payment) => ({
      ...payment,
      customer: {
        _id: payment.customerId,
        name:
          customerMap[payment.customerId.toString()]?.name ||
          "Unknown",
        phone:
          customerMap[payment.customerId.toString()]?.phone ||
          null,
      },
    }));

    return NextResponse.json(enrichedPayments);
  } catch (error) {
    console.error("GET_PAYMENT_HISTORY_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { customerId, amount, date, notes, nextDueDate } = body;

    if (!customerId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // find customer
    const customer = await Customer.findOne({
      _id: customerId,
      ownerId: session.user.id,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // prevent overpayment
    if (amount > customer.pendingAmount) {
      return NextResponse.json(
        { error: "Payment exceeds pending amount" },
        { status: 400 }
      );
    }

    // create payment record
    const payment = await Payment.create({
      customerId,
      ownerId: session.user.id,
      amount,
      date: date || new Date(),
      notes,
    });

    // update customer financials
    customer.paidAmount += amount;
    customer.pendingAmount -= amount;
    customer.lastPaymentDate = date || new Date();

    // 🔥 DUE DATE LOGIC
    if (customer.pendingAmount > 0) {
      // still pending → must have due date
      if (nextDueDate) {
        customer.nextDueDate = nextDueDate;
      }
    } else {
      // fully paid → remove due date
      customer.nextDueDate = null;
    }

    await customer.save();

    return NextResponse.json({
      message: "Payment recorded",
      payment,
      updatedCustomer: customer,
    });
  } catch (error) {
    console.error("PAYMENT_POST_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
