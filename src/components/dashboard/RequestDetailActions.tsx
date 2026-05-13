"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRequestStatus } from "@/actions/collaboration-requests";

interface RequestDetailActionsProps {
  requestId: string;
  brandName: string;
}

export function RequestDetailActions({
  requestId,
  brandName,
}: RequestDetailActionsProps) {
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    if (!confirmDialog) return;

    const newStatus = confirmDialog;
    setConfirmDialog(null);
    setError(null);

    startTransition(async () => {
      const result = await updateRequestStatus(requestId, newStatus);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to update status. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 ml-4"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setConfirmDialog("ACCEPTED")}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Accept Request"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmDialog("REJECTED")}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Reject Request"}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-confirm-dialog-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <h3
              id="detail-confirm-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              Confirm Status Change
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              <span className="font-medium">
                {confirmDialog === "ACCEPTED" ? "accept" : "reject"}
              </span>{" "}
              the request from{" "}
              <span className="font-medium">{brandName}</span>?
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  confirmDialog === "ACCEPTED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmDialog === "ACCEPTED" ? "Accept" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
