"use client";

import { Settings } from "lucide-react";
import SettingsComponent from '../settings/Settings'
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-neutral-200 rounded-full" />
        <div>
          <h2 className="font-semibold text-lg">Hi, {session?.user.name} 👋</h2>
          <p className="text-sm text-neutral-500">Today’s collections</p>
        </div>
      </div>

      <button
        className="p-2 rounded-xl bg-neutral-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Settings color="gray" />
      </button>

      {isOpen && <SettingsComponent setIsOpen={setIsOpen} />}
    </div>
  );
}
