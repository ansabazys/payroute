"use client"

import { useRouter } from "next/navigation";

export default function ActionIcon({ icon, label }: any) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center gap-1" onClick={() => router.push('/map')}>
      <div className=" py-3 gap-2 w-full flex-col text-blue-600 rounded-2xl flex items-center justify-center border border-neutral-100">
        <span>{icon}</span>
        <span className="text-xs text-neutral-600">{label}</span>
      </div>
    </div>
  );
}