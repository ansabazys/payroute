"use client";

import { ListFilter, X } from "lucide-react";
import { useState, useEffect } from "react";

const FILTERS = [
  { label: "High price", value: "high" },
  { label: "Low price", value: "low" },
  { label: "Nearest Due Date", value: "due" },
  { label: "Due today", value: "today" },
  { label: "Overdue", value: "overdue" },
];

export default function SearchBar({
  value,
  onSearch,
  onSort,
  currentSort,
}: any) {
  const [input, setInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(input);
    }, 400);

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="flex gap-3 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search customers..."
          className="bg-neutral-100 p-4 w-full rounded-2xl outline-0"
        />

        <div
          className="p-4 bg-neutral-100 rounded-2xl cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X color="gray" /> : <ListFilter color="gray" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-5 border flex flex-col gap-2 absolute top-16 right-0 rounded-2xl border-neutral-100 bg-white">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                onSort(filter.value);
                setIsOpen(false);
              }}
              className={`text-left ${
                currentSort === filter.value
                  ? "font-semibold"
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
