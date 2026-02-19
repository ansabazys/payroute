"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Phone,
  IndianRupee,
  LoaderCircle,
  Trash2,
  Navigation,
  Edit,
  UserRoundPen,
} from "lucide-react";
import Header from "@/components/common/Header";
import ActionIcon from "@/components/dashboard/ActionIcon";
import ConfimModal from "@/components/customers/ConfimModal";
import { ICustomer } from "@/types/customer";
import { IPayment } from "@/types/payment";

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<IPayment[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (id) fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customerRes = await fetch(`/api/customers/${id}`);
      const customerData = await customerRes.json();
      setCustomer(customerData);

      const paymentsRes = await fetch(
        `/api/customers/${customerData._id}/payments`,
      );
      const paymentsData = await paymentsRes.json();

      setPayments(paymentsData);
    } catch (error) {
      console.error(error);
    }
  };
  if (!customer)
    return (
      <div className="min-h-screen flex justify-center w-full items-center">
        <LoaderCircle className="animate-spin" color="gray" />
      </div>
    );

  const isPaid = customer.pendingAmount <= 0;

  const handleDelete = async () => {
    setLoading(true);

    const res = await fetch(`/api/customers/${id}`, {
      method: "DELETE",
    });

    setLoading(false);

    router.push("/customers");
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${customer.location?.lat},${customer.location?.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex justify-center pb-20">
      <div className="w-full max-w-md bg-white p-5 space-y-6">
        <div className="flex justify-between items-center">
          <Header />

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/customers/edit/${customer._id}`)}
              className="p-2  rounded-xl bg-neutral-100"
            >
              <UserRoundPen
                size={20}
                className="hover:text-red-400 text-gray-400 focus:text-red-400"
              />
            </button>

            <button
              className="p-2  rounded-xl bg-neutral-100"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <Trash2
                size={20}
                className="hover:text-red-400 text-gray-400 focus:text-red-400"
              />
            </button>
          </div>

          {isOpen && (
            <ConfimModal
              title="Delete customer?"
              paragraph="This action cannot be undone. The customer and payment history will be
          permanently removed."
              onClose={() => setIsOpen((prev) => !prev)}
              onConfirm={() => handleDelete()}
              loading={loading}
            />
          )}
        </div>

        {/* NAME */}
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-sm text-neutral-500">{customer.address}</p>
        </div>

        {/* AMOUNT CARD */}
        <div className="bg-neutral-100 rounded-2xl p-5">
          {isPaid ? (
            <p className="text-green-600 font-semibold text-lg">Paid ✅</p>
          ) : (
            <>
              <p className="text-sm text-neutral-500">Pending</p>
              <h2 className="text-3xl font-bold">₹{customer.pendingAmount}</h2>
            </>
          )}

          <div className="mt-3 text-sm text-neutral-500">
            Total ₹{customer.totalAmount} • Paid ₹{customer.paidAmount}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 place-content-center gap-4">
          <ActionIcon
            icon={<IndianRupee />}
            label="Payment"
            link={`payments/add/${customer._id}`}
          />
          <ActionIcon icon={<Phone />} label="Call" link={"/"} />
          <div
            className="flex flex-col items-center gap-1"
            onClick={handleNavigate}
          >
            <div className=" py-3 gap-2 w-full flex-col text-blue-600 rounded-2xl flex items-center justify-center border border-neutral-100">
              <Navigation />
              <span className="text-xs text-neutral-600">Navigate</span>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-sm">
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
          <p>Next due: {new Date(customer.nextDueDate!).toDateString()}</p>
        </div>

        {/* PAYMENT HISTORY */}
        <div>
          <h3 className="font-semibold mb-2">Payment history</h3>

          {payments.length === 0 ? (
            <p className="text-sm text-neutral-500">No payments recorded yet</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  onClick={() => router.push(`/payments/${payment._id}`)}
                  className="bg-green-50 border border-green-200 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-neutral-500">
                      {new Date(payment.date).toDateString()}
                    </p>

                    {payment.notes && (
                      <p className="text-xs text-neutral-400">
                        {payment.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      ₹{payment.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
