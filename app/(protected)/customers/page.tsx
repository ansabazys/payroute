import Header from "@/components/common/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import CustomerCard from "@/components/customers/CustomerCard";
import SearchBar from "@/components/customers/SearchBar";

export const dynamic = "force-dynamic";

export async function getCustomers(userId: string, q?: string, sort?: string) {
  await connectDB();

  const filter: any = { ownerId: userId };

  if (q) {
    filter.name = { $regex: q, $options: "i" };
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === "high") sortOption = { pendingAmount: -1 };
  if (sort === "low") sortOption = { pendingAmount: 1 };
  if (sort === "due") sortOption = { nextDueDate: 1 };

  const customers = await Customer.find(filter).sort(sortOption).lean();
  return JSON.parse(JSON.stringify(customers));
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string };
}) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const q = params?.q || "";
  const sort = params?.sort || "";

  console.log("Server Search query:", q, "Sort:", sort);

  const customers = await getCustomers(session.user.id, q, sort);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md gap-5 bg-white p-5 flex flex-col min-h-screen">
        <div className="flex flex-col gap-5">
          <Header />
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>

        <SearchBar />

        <div className="space-y-4 overflow-y-auto flex-1 pb-28">
          {customers.length === 0 ? (
            <p className="text-center text-neutral-500 mt-10">
              No customers found
            </p>
          ) : (
            customers.map((customer: any) => (
              <CustomerCard key={customer._id} customer={customer} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
