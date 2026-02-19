"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import EditPaymentForm from "@/components/payments/EditPaymentForm";
import { IPayment } from "@/types/payment";
import { ICustomer } from "@/types/customer";

export default function EditPaymentPage() {
  const { id } = useParams();
  const router = useRouter();


  const [payment, setPayment] = useState<IPayment | null>(null);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/payments/${id}`);
      console.log()
      if (!res.ok) {
        router.push("/customers");
        return;
      }

      const data = await res.json();


      setPayment(data.payment);
      setCustomer(data.customer);
    } catch (err) {
      console.error("Edit page fetch error:", err);
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  if (!payment || !customer) return null;

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center pb-25">
      <div className="w-full max-w-md bg-white p-5">
        <h1 className="text-xl font-bold mb-5">
          Edit Payment
        </h1>

        <EditPaymentForm
          payment={payment}
          customer={customer}
        />
      </div>
    </div>
  );
}
