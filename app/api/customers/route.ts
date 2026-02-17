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
        { status: 400 }
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
      nextDueDate: new Date(nextDueDate),
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
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q");
    const sort = searchParams.get("sort");

    const filter: any = {
      ownerId: session.user.id,
    };

    // 🔍 Search
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    // 📅 TODAY FILTER
    if (sort === "today") {
      const today = new Date();

      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0, 0, 0, 0
      );

      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23, 59, 59, 999
      );

      filter.nextDueDate = {
        $gte: start,
        $lte: end,
      };

      filter.pendingAmount = { $gt: 0 };
    }

    // 📅 OVERDUE FILTER
    if (sort === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filter.nextDueDate = { $lt: today };
      filter.pendingAmount = { $gt: 0 };
    }

    // 📊 SORT
    let sortOption: any = { createdAt: -1 };

    if (sort === "high") sortOption = { pendingAmount: -1 };
    if (sort === "low") sortOption = { pendingAmount: 1 };
    if (sort === "due") sortOption = { nextDueDate: 1 };

    const customers = await Customer.find(filter)
      .sort(sortOption)
      .lean();

    return NextResponse.json(customers);

  } catch (error) {
    console.error("GET_CUSTOMERS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

