import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "overdue";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter: any = {
      ownerId: session.user.id,
    };

    // 🔥 ROUTE LOGIC
    if (type === "today") {
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      filter.pendingAmount = { $gt: 0 };
      filter.nextDueDate = { $gte: today, $lte: end };
    }

    if (type === "overdue") {
      filter.pendingAmount = { $gt: 0 };
      filter.nextDueDate = { $lt: today };
    }

    if (type === "pending") {
      filter.pendingAmount = { $gt: 0 };
    }

    if (type === "all") {
      // no extra filter
    }

    const customers = await Customer.find(filter)
      .select("name phone location pendingAmount nextDueDate")
      .lean();

    return NextResponse.json(customers);
  } catch (error) {
    console.error("ROUTES_API_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch route customers" },
      { status: 500 }
    );
  }
}
