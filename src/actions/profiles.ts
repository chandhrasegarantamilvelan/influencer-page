"use server";

import { prisma } from "@/lib/prisma";
import {
  createSocialProfileSchema,
  updateSocialProfileSchema,
} from "@/lib/validators";
import type { ActionResult } from "@/types";

/**
 * Server Action: Create a new social profile.
 *
 * Accepts FormData, validates with Zod schema, and stores in the database.
 * Returns ActionResult with the created profile ID or field-level errors.
 *
 * @param formData - The form data submitted by the admin
 * @returns ActionResult with success data or validation errors
 */
export async function createSocialProfile(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const rawFollowerCount = formData.get("followerCount");
  const parsedFollowerCount =
    rawFollowerCount !== null && rawFollowerCount !== ""
      ? Number(rawFollowerCount)
      : undefined;

  const rawData = {
    platformName: (formData.get("platformName") as string | null) ?? "",
    handle: (formData.get("handle") as string | null) ?? "",
    profileUrl: (formData.get("profileUrl") as string | null) ?? "",
    followerCount: parsedFollowerCount,
    bioExcerpt:
      (formData.get("bioExcerpt") as string | null) || undefined,
    iconUrl:
      (formData.get("iconUrl") as string | null) || undefined,
  };

  const result = createSocialProfileSchema.safeParse(rawData);

  if (!result.success) {
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

  try {
    const profile = await prisma.socialProfile.create({
      data: {
        platformName: validated.platformName,
        handle: validated.handle,
        profileUrl: validated.profileUrl,
        followerCount: validated.followerCount,
        bioExcerpt: validated.bioExcerpt ?? null,
        iconUrl: validated.iconUrl ?? null,
      },
    });

    return {
      success: true,
      data: { id: profile.id },
    };
  } catch (error) {
    console.error("[Action] Failed to create social profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Update an existing social profile.
 *
 * Accepts an ID and FormData, validates with Zod schema, and updates the DB record.
 * Only fields present in the FormData will be updated.
 *
 * @param id - The profile ID to update
 * @param formData - The form data submitted by the admin
 * @returns ActionResult indicating success or field-level errors
 */
export async function updateSocialProfile(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Profile ID is required.",
    };
  }

  const rawFollowerCount = formData.get("followerCount");
  const parsedFollowerCount =
    rawFollowerCount !== null && rawFollowerCount !== ""
      ? Number(rawFollowerCount)
      : undefined;

  const rawData: Record<string, unknown> = {};

  const platformName = formData.get("platformName") as string | null;
  if (platformName !== null && platformName !== "") {
    rawData.platformName = platformName;
  }

  const handle = formData.get("handle") as string | null;
  if (handle !== null && handle !== "") {
    rawData.handle = handle;
  }

  const profileUrl = formData.get("profileUrl") as string | null;
  if (profileUrl !== null && profileUrl !== "") {
    rawData.profileUrl = profileUrl;
  }

  if (parsedFollowerCount !== undefined) {
    rawData.followerCount = parsedFollowerCount;
  }

  const bioExcerpt = formData.get("bioExcerpt") as string | null;
  if (bioExcerpt !== null) {
    rawData.bioExcerpt = bioExcerpt || undefined;
  }

  const iconUrl = formData.get("iconUrl") as string | null;
  if (iconUrl !== null) {
    rawData.iconUrl = iconUrl || undefined;
  }

  const result = updateSocialProfileSchema.safeParse(rawData);

  if (!result.success) {
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

  try {
    // Verify the profile exists
    const existing = await prisma.socialProfile.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        error: "Profile not found.",
      };
    }

    // Build update data only with provided fields
    const updateData: Record<string, unknown> = {};
    if (validated.platformName !== undefined) {
      updateData.platformName = validated.platformName;
    }
    if (validated.handle !== undefined) {
      updateData.handle = validated.handle;
    }
    if (validated.profileUrl !== undefined) {
      updateData.profileUrl = validated.profileUrl;
    }
    if (validated.followerCount !== undefined) {
      updateData.followerCount = validated.followerCount;
    }
    if (validated.bioExcerpt !== undefined) {
      updateData.bioExcerpt = validated.bioExcerpt;
    }
    if (validated.iconUrl !== undefined) {
      updateData.iconUrl = validated.iconUrl;
    }

    await prisma.socialProfile.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Action] Failed to update social profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Delete a social profile.
 *
 * Permanently removes the profile from the database.
 *
 * @param id - The profile ID to delete
 * @returns ActionResult indicating success or error
 */
export async function deleteSocialProfile(
  id: string
): Promise<ActionResult<void>> {
  if (!id || typeof id !== "string") {
    return {
      success: false,
      error: "Profile ID is required.",
    };
  }

  try {
    // Verify the profile exists before deleting
    const existing = await prisma.socialProfile.findUnique({
      where: { id },
    });

    if (!existing) {
      return {
        success: false,
        error: "Profile not found.",
      };
    }

    await prisma.socialProfile.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Action] Failed to delete social profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
