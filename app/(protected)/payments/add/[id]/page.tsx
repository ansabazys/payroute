"use client";

import Header from "@/components/common/Header";
import AddPaymentForm from "@/components/payments/AddPaymentForm";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentAdd() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    setLoading(true);
    const res = await fetch(`/api/customers/${id}`);
    const data = await res.json();

    setLoading(false);
    setCustomer(data);
  };

  if (loading && !customer)
    return (
      <div className="min-h-screen flex justify-center w-full items-center">
        <LoaderCircle className="animate-spin" color="gray" />
      </div>
    );

  return (
    <div className="p-5 grid gap-5 pb-25">
      <Header />
      {customer && <AddPaymentForm customer={customer} />}
    </div>
  );
}
