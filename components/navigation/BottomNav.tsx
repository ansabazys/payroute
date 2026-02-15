"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, LayoutDashboard, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full backdrop-blur-xl">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">

        {/* Dashboard */}
        <Link href="/dashboard" className="flex flex-col items-center">
          <LayoutDashboard
            size={22}
            className={pathname === "/dashboard"
              ? "text-black-600"
              : "text-neutral-500"}
          />
          <span className="text-xs">Dashboard</span>
        </Link>

            <Link href="/dashboard" className="flex flex-col items-center">
          <Plus
            size={22}
            className={pathname === "/add"
              ? "text-black-600"
              : "text-neutral-500"}
          />
          <span className="text-xs">Add Customer</span>
        </Link>



        {/* Customers */}
        <Link href="/customers" className="flex flex-col items-center">
          <Users
            size={22}
            className={pathname === "/customers"
              ? "text-purple-600"
              : "text-neutral-500"}
          />
          <span className="text-xs">Customers</span>
        </Link>

 
      </div>
    </div>
  );
}
