"use client";

import { LoaderCircle } from "lucide-react";

type Props = {
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ loading, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-xs mx-4 rounded-2xl p-6  animate-in fade-in zoom-in-95">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">Delete customer?</h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-neutral-500 mt-2">
          This action cannot be undone. The customer and payment history will be
          permanently removed.
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-neutral-200 text-neutral-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
