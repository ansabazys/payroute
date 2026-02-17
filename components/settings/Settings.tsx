import { X } from "lucide-react";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

type SettingsProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Settings({ setIsOpen }: SettingsProps) {
  return (
    <div className="absolute min-h-screen p-5 w-full bg-white left-0 top-0 z-10 flex flex-col gap-5 justify-between">
      <div className="flex justify-between items-center">
        <div className="h-12 flex items-center">
          <h1 className="text-2xl font-bold tracking-tighter">Settings</h1>
        </div>

        <button
          className="p-2 rounded-xl bg-neutral-100"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <X color="gray" />
        </button>
      </div>

      <div
        className="p-4 border rounded-2xl border-neutral-100 text-center"
        onClick={() => signOut()}
      >
        <button>Log out</button>
      </div>
    </div>
  );
}
