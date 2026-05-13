"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { collaborationRequestSchema } from "@/lib/validators";
import { submitCollaborationRequest } from "@/actions/collaboration-requests";
import type { CollaborationRequestState } from "@/actions/collaboration-requests";
import type { CollaborationType, BudgetRange } from "@/types";
import { PremiumButton } from "@/components/ui/PremiumButton";

const COLLABORATION_TYPE_OPTIONS: { value: CollaborationType; label: string }[] = [
  { value: "sponsored_post", label: "Sponsored Post" },
  { value: "product_review", label: "Product Review" },
  { value: "brand_ambassador", label: "Brand Ambassador" },
  { value: "giveaway", label: "Giveaway" },
  { value: "event_appearance", label: "Event Appearance" },
  { value: "other", label: "Other" },
];

const BUDGET_RANGE_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under_500", label: "Under $500" },
  { value: "500_1000", label: "$500–$1,000" },
  { value: "1000_5000", label: "$1,000–$5,000" },
  { value: "5000_10000", label: "$5,000–$10,000" },
  { value: "over_10000", label: "Over $10,000" },
];

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function CollaborationRequestForm() {
  const [state, formAction, isPending] = useActionState<CollaborationRequestState, FormData>(
    submitCollaborationRequest,
    null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleClientValidation(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const formData = new FormData(form);

    const rawData = {
      brandName: formData.get("brandName") as string,
      contactName: formData.get("contactName") as string,
      contactEmail: formData.get("contactEmail") as string,
      collaborationType: formData.get("collaborationType") as string,
      budgetRange: formData.get("budgetRange") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      description: formData.get("description") as string,
    };

    const result = collaborationRequestSchema.safeParse(rawData);

    if (!result.success) {
      e.preventDefault();
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    // Clear client errors on valid submission
    setFieldErrors({});
  }

  // Show confirmation on success
  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center py-12 px-6"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-maroon to-cabernet flex items-center justify-center shine-overlay">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Request Submitted Successfully!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for your collaboration request. We&apos;ll review your proposal and get back to you soon.
        </p>
      </motion.div>
    );
  }

  const today = getTodayString();

  return (
    <form
      action={formAction}
      onSubmit={handleClientValidation}
      className="space-y-6"
      noValidate
    >
      {/* Server-side error banner */}
      {state?.error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Brand Name */}
      <div>
        <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
          Brand Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="brandName"
          name="brandName"
          maxLength={100}
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.brandName || state?.fieldErrors?.brandName
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors`}
          placeholder="Your brand or company name"
        />
        {(fieldErrors.brandName || state?.fieldErrors?.brandName?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.brandName || state?.fieldErrors?.brandName?.[0]}
          </p>
        )}
      </div>

      {/* Contact Name */}
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Person Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contactName"
          name="contactName"
          maxLength={100}
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.contactName || state?.fieldErrors?.contactName
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors`}
          placeholder="Your full name"
        />
        {(fieldErrors.contactName || state?.fieldErrors?.contactName?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.contactName || state?.fieldErrors?.contactName?.[0]}
          </p>
        )}
      </div>

      {/* Contact Email */}
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.contactEmail || state?.fieldErrors?.contactEmail
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors`}
          placeholder="you@company.com"
        />
        {(fieldErrors.contactEmail || state?.fieldErrors?.contactEmail?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.contactEmail || state?.fieldErrors?.contactEmail?.[0]}
          </p>
        )}
      </div>

      {/* Collaboration Type */}
      <div>
        <label htmlFor="collaborationType" className="block text-sm font-medium text-gray-700 mb-1">
          Collaboration Type <span className="text-red-500">*</span>
        </label>
        <select
          id="collaborationType"
          name="collaborationType"
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.collaborationType || state?.fieldErrors?.collaborationType
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors bg-white`}
          defaultValue=""
        >
          <option value="" disabled>
            Select collaboration type
          </option>
          {COLLABORATION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(fieldErrors.collaborationType || state?.fieldErrors?.collaborationType?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.collaborationType || state?.fieldErrors?.collaborationType?.[0]}
          </p>
        )}
      </div>

      {/* Budget Range */}
      <div>
        <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="budgetRange"
          name="budgetRange"
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.budgetRange || state?.fieldErrors?.budgetRange
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors bg-white`}
          defaultValue=""
        >
          <option value="" disabled>
            Select budget range
          </option>
          {BUDGET_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(fieldErrors.budgetRange || state?.fieldErrors?.budgetRange?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.budgetRange || state?.fieldErrors?.budgetRange?.[0]}
          </p>
        )}
      </div>

      {/* Timeline / Campaign Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            min={today}
            className={`w-full px-4 py-3 rounded-lg border ${
              fieldErrors.startDate || state?.fieldErrors?.startDate
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-gold/40"
            } focus:outline-none focus:ring-2 transition-colors`}
          />
          {(fieldErrors.startDate || state?.fieldErrors?.startDate?.[0]) && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.startDate || state?.fieldErrors?.startDate?.[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            min={today}
            className={`w-full px-4 py-3 rounded-lg border ${
              fieldErrors.endDate || state?.fieldErrors?.endDate
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-gold/40"
            } focus:outline-none focus:ring-2 transition-colors`}
          />
          {(fieldErrors.endDate || state?.fieldErrors?.endDate?.[0]) && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.endDate || state?.fieldErrors?.endDate?.[0]}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={1000}
          className={`w-full px-4 py-3 rounded-lg border ${
            fieldErrors.description || state?.fieldErrors?.description
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-gold/40"
          } focus:outline-none focus:ring-2 transition-colors resize-vertical`}
          placeholder="Tell us about your collaboration idea, goals, and expectations..."
        />
        {(fieldErrors.description || state?.fieldErrors?.description?.[0]) && (
          <p className="mt-1 text-sm text-red-600">
            {fieldErrors.description || state?.fieldErrors?.description?.[0]}
          </p>
        )}
      </div>

      {/* Submit Button - Premium styling */}
      <div className="pt-4">
        <PremiumButton
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Collaboration Request"
          )}
        </PremiumButton>
      </div>
    </form>
  );
}
