"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, LayoutDashboard, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 h-20 w-full flex justify-center">
      <div className="flex w-full  max-w-50 justify-between px-5 backdrop-blur-lg border border-neutral-100 rounded-2xl mb-5 items-center py-4">
        {/* Dashboard */}
        <Link href="/dashboard" className="flex flex-col items-center ">
          {/* <LayoutDashboard
            size={22}
            className={pathname === "/dashboard"
              ? "text-black-600"
              : "text-neutral-500"}
          /> */}

          {pathname === "/dashboard" ? (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              width={22}
            >
              <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="gray"
              width={22}
            >
              <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path>
            </svg>
          )}

          {/* <span className="text-xs">Dashboard</span> */}
        </Link>

        <Link href="/customers/add" className="flex flex-col items-center">
          <Plus
            size={22}
            className={
              pathname === "/customers/add" ? "text-black-600" : "text-neutral-500"
            }
          />
          {/* <span className="text-xs">Add Customer</span> */}
        </Link>

        {/* Customers */}
        <Link href="/customers" className="flex flex-col items-center">
          <Users
            size={22}
            className={
              pathname === "/customers" ? "text-black-600" : "text-neutral-500"
            }
          />
          {/* <span className="text-xs">Customers</span> */}
        </Link>
      </div>
      
      

    </div>
  );
}
