import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    const customer = await Customer.findOne({
      _id: id,
      ownerId: session.user.id,
    }).lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("GET_CUSTOMER_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch customer" },
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

    const { id } = await context.params;

    // 🔐 ensure this customer belongs to the logged-in user
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

    // 🧾 delete payments first
    // await Payment.deleteMany({ id });

    // 👤 delete customer
    await Customer.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return NextResponse.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_CUSTOMER_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // 🔥 First fetch existing customer
    const existingCustomer = await Customer.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const paidAmount = existingCustomer.paidAmount || 0;
    const totalAmount = Number(body.totalAmount) || 0;

    if (totalAmount < paidAmount) {
      return NextResponse.json(
        { error: "Total amount cannot be less than paid amount" },
        { status: 400 }
      );
    }

    const pendingAmount = totalAmount - paidAmount;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, ownerId: session.user.id },
      {
        name: body.name,
        phone: body.phone,
        address: body.address,
        totalAmount: totalAmount,
        pendingAmount: pendingAmount,
        nextDueDate: pendingAmount > 0 ? body.nextDueDate : null,
      },
      { returnDocument: "after" }
    );

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("UPDATE_CUSTOMER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

