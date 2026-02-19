import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

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


    // 🔎 find payment
    const payment = await Payment.findById({
      _id: new mongoose.Types.ObjectId(id),
      ownerId: session.user.id,
    }).lean();



    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 🔎 find customer linked to payment
    const customer = await Customer.findOne({
      _id: payment.customerId,
      ownerId: session.user.id,
    }).lean();

    return NextResponse.json({
      payment,
      customer,
    });
  } catch (error) {
    console.error("GET_PAYMENT_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch payment" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { id } = await context.params;

    const { amount, date, notes, nextDueDate } = await req.json();

    const payment = await Payment.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!payment)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    const customer = await Customer.findOne({
      _id: payment.customerId,
      ownerId: session.user.id,
    });

    if (!customer)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );

    // 🔥 revert old payment impact
    customer.paidAmount -= payment.amount;
    customer.pendingAmount += payment.amount;

    // 🔥 apply new payment
    customer.paidAmount += amount;
    customer.pendingAmount -= amount;

    customer.lastPaymentDate = date || new Date();

    // due date logic
    if (customer.pendingAmount > 0) {
      if (nextDueDate) customer.nextDueDate = nextDueDate;
    } else {
      customer.nextDueDate = null;
    }

    await customer.save();

    // update payment document
    payment.amount = amount;
    payment.date = date || payment.date;
    payment.notes = notes;

    await payment.save();

    return NextResponse.json({
      message: "Payment updated",
      payment,
      customer,
    });
  } catch (error) {
    console.error("PAYMENT_EDIT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
 context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const {id} = await context.params

    // 1️⃣ Find payment
    const payment = await Payment.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Find related customer
    const customer = await Customer.findOne({
      _id: payment.customerId,
      ownerId: session.user.id,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Revert financial values
    customer.paidAmount -= payment.amount;
    customer.pendingAmount += payment.amount;

    // 4️⃣ Update last payment date
    const lastPayment = await Payment.find({
      customerId: customer._id,
      ownerId: session.user.id,
      _id: { $ne: payment._id },
    })
      .sort({ date: -1 })
      .limit(1);

    customer.lastPaymentDate = lastPayment.length
      ? lastPayment[0].date
      : null;

    // 5️⃣ Due date logic
    if (customer.pendingAmount <= 0) {
      customer.nextDueDate = null;
    }

    await customer.save();

    // 6️⃣ Delete payment
    await payment.deleteOne();

    return NextResponse.json({
      message: "Payment deleted successfully",
      updatedCustomer: customer,
    });
  } catch (error) {
    console.error("DELETE_PAYMENT_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
