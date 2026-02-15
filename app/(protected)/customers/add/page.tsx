import AddForm from "@/components/customers/AddForm";

export default function AddCustomer() {
  return (
    <section className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 gap-5 flex flex-col h-screen">
        <h1 className="text-xl font-semibold">Add Customer</h1>
        <AddForm />
      </div>
    </section>
  );
}
