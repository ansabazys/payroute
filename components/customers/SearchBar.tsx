"use client";

import { Funnel, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FILTERS = [
  { label: "High price", value: "high" },
  { label: "Low price", value: "low" },
  { label: "Nearest Due Date", value: "due" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "";
  const initialQ = searchParams.get("q") || "";

  const [value, setValue] = useState(initialQ);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      const newUrl = `/customers?${params.toString()}`;
      const currentUrl = window.location.pathname + window.location.search;

      if (newUrl !== currentUrl) {
        router.replace(newUrl);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleFilter = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);

    const newUrl = `/customers?${params.toString()}`;
    const currentUrl = window.location.pathname + window.location.search;

    if (newUrl !== currentUrl) {
      router.replace(newUrl);
    }

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="flex gap-3 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search customers..."
          className="bg-neutral-100 p-4 w-full rounded-2xl outline-0"
        />

        <div
          className="p-4 bg-neutral-100 rounded-2xl cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X color="gray" /> : <Funnel color="gray" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-5 border flex flex-col gap-2 absolute top-16 backdrop-blur-2xl right-0 border-neutral-100 rounded-2xl bg-white">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilter(filter.value)}
              className={`text-left ${
                currentSort === filter.value
                  ? "font-semibold text-black"
                  : "text-neutral-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
