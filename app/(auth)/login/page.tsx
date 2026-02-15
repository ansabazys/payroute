import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="h-screen w-full flex-col flex text-black justify-end items-center bg-white">
      {/* <div className="flex p-5 justify-end w-full">
           <div className="border px-2 border-black/15 rounded-xl bg-neutral-100">
             <h1>Register</h1>
           </div>
         </div> */}

      <div className="m-3 p-5 flex flex-col gap-6 bg-white w-full rounded-3xl">
        <div>
          <h1 className="text-lg">Welcome to PayRoute</h1>
          <p className="font-semibold text-4xl tracking-tight">
            Never miss a payment or forget a customer’s address again.
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
}
