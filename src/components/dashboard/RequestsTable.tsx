"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateRequestStatus } from "@/actions/collaboration-requests";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
type FilterStatus = "all" | "pending" | "accepted" | "rejected";

interface CollaborationRequest {
  id: string;
  brandName: string;
  contactEmail: string;
  collaborationType: string;
  createdAt: string;
  status: RequestStatus;
}

interface RequestsTableProps {
  requests: CollaborationRequest[];
}

const collaborationTypeLabels: Record<string, string> = {
  SPONSORED_POST: "Sponsored Post",
  PRODUCT_REVIEW: "Product Review",
  BRAND_AMBASSADOR: "Brand Ambassador",
  GIVEAWAY: "Giveaway",
  EVENT_APPEARANCE: "Event Appearance",
  OTHER: "Other",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

export function RequestsTable({ requests }: RequestsTableProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [localRequests, setLocalRequests] = useState(requests);
  const [confirmDialog, setConfirmDialog] = useState<{
    requestId: string;
    brandName: string;
    newStatus: "ACCEPTED" | "REJECTED";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRequests = localRequests.filter((req) => {
    if (filter === "all") return true;
    return req.status.toLowerCase() === filter;
  });

  function handleStatusChange(
    requestId: string,
    brandName: string,
    newStatus: "ACCEPTED" | "REJECTED"
  ) {
    setError(null);
    setConfirmDialog({ requestId, brandName, newStatus });
  }

  function confirmStatusChange() {
    if (!confirmDialog) return;

    const { requestId, newStatus } = confirmDialog;
    const previousRequests = [...localRequests];

    // Optimistic update
    setLocalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    setConfirmDialog(null);

    startTransition(async () => {
      const result = await updateRequestStatus(requestId, newStatus);
      if (!result.success) {
        // Revert optimistic update
        setLocalRequests(previousRequests);
        setError(result.error || "Failed to update status. Please try again.");
      }
    });
  }

  function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
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

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "accepted", "rejected"] as FilterStatus[]).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? "bg-gradient-to-r from-cabernet/10 to-maroon/10 text-cabernet border border-cabernet/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">
            No requests match the selected filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/requests/${request.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-cabernet transition-colors"
                      >
                        {request.brandName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.contactEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {collaborationTypeLabels[request.collaborationType] ||
                        request.collaborationType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {request.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  request.id,
                                  request.brandName,
                                  "ACCEPTED"
                                )
                              }
                              disabled={isPending}
                              className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  request.id,
                                  request.brandName,
                                  "REJECTED"
                                )
                              }
                              disabled={isPending}
                              className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/dashboard/requests/${request.id}`}
                          className="text-xs px-3 py-1.5 rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-gray-50">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/requests/${request.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-cabernet transition-colors"
                  >
                    {request.brandName}
                  </Link>
                  <StatusBadge status={request.status} />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{request.contactEmail}</p>
                  <p>
                    {collaborationTypeLabels[request.collaborationType] ||
                      request.collaborationType}{" "}
                    · {formatDate(request.createdAt)}
                  </p>
                </div>
                {request.status === "PENDING" && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          request.id,
                          request.brandName,
                          "ACCEPTED"
                        )
                      }
                      disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          request.id,
                          request.brandName,
                          "REJECTED"
                        )
                      }
                      disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              Confirm Status Change
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              <span className="font-medium">
                {confirmDialog.newStatus === "ACCEPTED" ? "accept" : "reject"}
              </span>{" "}
              the request from{" "}
              <span className="font-medium">{confirmDialog.brandName}</span>?
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
                onClick={confirmStatusChange}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  confirmDialog.newStatus === "ACCEPTED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmDialog.newStatus === "ACCEPTED" ? "Accept" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
