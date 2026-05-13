"use server";

import { prisma } from "@/lib/prisma";
import { collaborationRequestSchema } from "@/lib/validators";
import { sendAdminNotification } from "@/lib/email";
import type { ActionResult } from "@/types";
import type {
  CollaborationType as PrismaCollaborationType,
  BudgetRange as PrismaBudgetRange,
  RequestStatus as PrismaRequestStatus,
} from "@/generated/prisma";

export type CollaborationRequestState = ActionResult<{ id: string }> | null;

/**
 * Maps form collaboration type values to Prisma enum values.
 */
const collaborationTypeMap: Record<string, PrismaCollaborationType> = {
  sponsored_post: "SPONSORED_POST",
  product_review: "PRODUCT_REVIEW",
  brand_ambassador: "BRAND_AMBASSADOR",
  giveaway: "GIVEAWAY",
  event_appearance: "EVENT_APPEARANCE",
  other: "OTHER",
};

/**
 * Maps form budget range values to Prisma enum values.
 */
const budgetRangeMap: Record<string, PrismaBudgetRange> = {
  under_500: "UNDER_500",
  "500_1000": "RANGE_500_1000",
  "1000_5000": "RANGE_1000_5000",
  "5000_10000": "RANGE_5000_10000",
  over_10000: "OVER_10000",
};

/**
 * Server Action: Submit a collaboration request.
 *
 * Accepts FormData (compatible with useActionState), validates with Zod,
 * stores in the database with PENDING status, and triggers an admin email notification.
 *
 * @param _prevState - Previous action state (used by useActionState)
 * @param formData - The form data submitted by the user
 * @returns ActionResult with success/error/fieldErrors
 */
export async function submitCollaborationRequest(
  _prevState: CollaborationRequestState,
  formData: FormData
): Promise<CollaborationRequestState> {
  // Extract raw form values
  const rawData = {
    brandName: formData.get("brandName") as string | null,
    contactName: formData.get("contactName") as string | null,
    contactEmail: formData.get("contactEmail") as string | null,
    collaborationType: formData.get("collaborationType") as string | null,
    budgetRange: formData.get("budgetRange") as string | null,
    startDate: formData.get("startDate") as string | null,
    endDate: formData.get("endDate") as string | null,
    description: formData.get("description") as string | null,
  };

  // Validate with Zod
  const result = collaborationRequestSchema.safeParse({
    brandName: rawData.brandName ?? "",
    contactName: rawData.contactName ?? "",
    contactEmail: rawData.contactEmail ?? "",
    collaborationType: rawData.collaborationType ?? "",
    budgetRange: rawData.budgetRange ?? "",
    startDate: rawData.startDate ?? "",
    endDate: rawData.endDate ?? "",
    description: rawData.description ?? "",
  });

  if (!result.success) {
    // Convert Zod errors to field errors map
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    }

    return {
      success: false,
      error: "Please fix the errors below and try again.",
      fieldErrors,
    };
  }

  const validated = result.data;

  // Map form values to Prisma enum values
  const prismaCollaborationType = collaborationTypeMap[validated.collaborationType];
  const prismaBudgetRange = budgetRangeMap[validated.budgetRange];

  if (!prismaCollaborationType || !prismaBudgetRange) {
    return {
      success: false,
      error: "Invalid collaboration type or budget range.",
    };
  }

  try {
    // Store in database with PENDING status
    const request = await prisma.collaborationRequest.create({
      data: {
        brandName: validated.brandName,
        contactName: validated.contactName,
        contactEmail: validated.contactEmail,
        collaborationType: prismaCollaborationType,
        budgetRange: prismaBudgetRange,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        description: validated.description,
        status: "PENDING",
      },
    });

    // Trigger admin email notification (fire-and-forget to not block response)
    sendAdminNotification({
      brandName: validated.brandName,
      contactEmail: validated.contactEmail,
      collaborationType: validated.collaborationType,
      requestId: request.id,
    }).catch((error) => {
      console.error("[Action] Failed to send admin notification:", error);
    });

    return {
      success: true,
      data: { id: request.id },
    };
  } catch (error) {
    console.error("[Action] Failed to store collaboration request:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}


/**
 * Valid status values that can be set via the admin dashboard.
 */
const validStatuses: PrismaRequestStatus[] = ["PENDING", "ACCEPTED", "REJECTED"];

/**
 * Server Action: Update the status of a collaboration request.
 *
 * @param requestId - The ID of the collaboration request to update
 * @param status - The new status (PENDING, ACCEPTED, or REJECTED)
 * @returns ActionResult indicating success or failure
 */
export async function updateRequestStatus(
  requestId: string,
  status: string
): Promise<ActionResult<void>> {
  // Validate status
  const upperStatus = status.toUpperCase() as PrismaRequestStatus;
  if (!validStatuses.includes(upperStatus)) {
    return {
      success: false,
      error: "Invalid status. Must be one of: pending, accepted, rejected.",
    };
  }

  // Validate requestId
  if (!requestId || typeof requestId !== "string") {
    return {
      success: false,
      error: "Invalid request ID.",
    };
  }

  try {
    // Check if request exists
    const existing = await prisma.collaborationRequest.findUnique({
      where: { id: requestId },
    });

    if (!existing) {
      return {
        success: false,
        error: "Collaboration request not found.",
      };
    }

    // Update the status
    await prisma.collaborationRequest.update({
      where: { id: requestId },
      data: { status: upperStatus },
    });

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to update request status:", error);
    return {
      success: false,
      error: "Failed to update status. Please try again.",
    };
  }
}
