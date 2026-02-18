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
