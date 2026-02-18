import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const ownerId = new mongoose.Types.ObjectId(session.user.id);

    // 🧾 Total pending
    const pendingAgg = await Customer.aggregate([
      { $match: { ownerId } },
      { $group: { _id: null, total: { $sum: "$pendingAmount" } } },
    ]);

    // 💰 Total paid
    const paidAgg = await Customer.aggregate([
      { $match: { ownerId } },
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);

    // 📅 Today collection
    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    const todayAgg = await Customer.aggregate([
      {
        $match: {
          ownerId,
          nextDueDate: { $gte: start, $lte: end },
          pendingAmount: { $gt: 0 },
        },
      },
      { $group: { _id: null, total: { $sum: "$pendingAmount" } } },
    ]);

    // 🔴 Overdue amount
    const overdueAgg = await Customer.aggregate([
      {
        $match: {
          ownerId,
          nextDueDate: { $lt: start },
          pendingAmount: { $gt: 0 },
        },
      },
      { $group: { _id: null, total: { $sum: "$pendingAmount" } } },
    ]);

    // 👥 Total customers
    const totalCustomers = await Customer.countDocuments({ ownerId });

    return NextResponse.json({
      totalPending: pendingAgg[0]?.total || 0,
      totalPaid: paidAgg[0]?.total || 0,
      todayCollection: todayAgg[0]?.total || 0,
      overdueAmount: overdueAgg[0]?.total || 0,
      totalCustomers,
    });
  } catch (error) {
    console.error("ANALYTICS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
