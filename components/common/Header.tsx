"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Header() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="w-9 h-9 flex justify-center items-center bg-neutral-200 rounded-full"
    >
      <ChevronLeft color="gray" />
    </div>
  );
}
