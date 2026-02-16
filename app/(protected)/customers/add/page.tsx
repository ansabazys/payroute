import Header from "@/components/common/Header";
import AddForm from "@/components/customers/AddForm";

export default function AddCustomer() {
  return (
    <section className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white flex flex-col min-h-screen">
        <div className="p-5 flex flex-col gap-5">
         
         <Header />

          <h1 className="text-xl font-semibold">Add Customer</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-28">
          <AddForm />
        </div>
      </div>
    </section>
  );
}
