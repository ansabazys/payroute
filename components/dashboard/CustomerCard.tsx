import { IndianRupee, MapPin, Phone } from "lucide-react";

export default function CustomerCard({ name, amount, status }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-1 border border-neutral-100">
      <div className="flex justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-yellow-600 font-semibold">{amount}</span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-red-500">{status}</p>

        <div className="flex gap-3">
          <Phone size={18} className="text-neutral-600" />
          <MapPin size={18} className="text-neutral-600" />
          <IndianRupee size={18} className="text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
