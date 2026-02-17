"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import CustomerCard from "@/components/customers/CustomerCard";
import SearchBar from "@/components/customers/SearchBar";
import { LoaderCircle } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [q, sort]);

  const fetchCustomers = async () => {
    setLoading(true);

    const res = await fetch(`/api/customers?q=${q}&sort=${sort}`);
    const data = await res.json();

    setCustomers(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md gap-5 bg-white p-5 flex flex-col h-screen">

        <Header />
        <h1 className="text-2xl font-bold">Customers</h1>

        <SearchBar
          value={q}
          onSearch={setQ}
          onSort={setSort}
          currentSort={sort}
        />

        <div className="space-y-4 overflow-y-auto flex-1 pb-28">
          {loading && <div className="flex justify-center h-full items-center">
            <LoaderCircle color="gray" className="animate-spin" />
            </div>}

          {!loading && customers.length === 0 && (
            <p className="text-center text-neutral-500 mt-10">
              No customers found
            </p>
          )}

          {customers.map((customer: any) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      </div>
    </div>
  );
}
