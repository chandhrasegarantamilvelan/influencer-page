"use server";

import { prisma } from "@/lib/prisma";
import {
  createPortfolioItemSchema,
  updatePortfolioItemSchema,
  portfolioFileSchema,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { MediaType as PrismaMediaType } from "@/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Determines the Prisma MediaType enum value from a MIME type string.
 */
function getMediaTypeFromMime(mimeType: string): PrismaMediaType {
  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }
  return "IMAGE";
}

/**
 * Saves an uploaded file to the public/uploads directory and returns the URL path.
 */
async function saveUploadedFile(file: File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Generate a unique filename to avoid collisions
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${timestamp}-${sanitizedName}`;
  const filepath = path.join(uploadsDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

/**
 * Server Action: Create a new portfolio item.
 *
 * Accepts FormData with title (max 100 chars), file (max 50MB, JPEG/PNG/GIF/MP4/MOV),
 * brand, and category. Saves the file to public/uploads, creates a DB record with active=true.
 *
 * @param formData - The form data submitted by the admin
 * @returns ActionResult with the created item's ID or error details
 */
export async function createPortfolioItem(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const title = formData.get("title") as string | null;
  const file = formData.get("file") as File | null;
  const brand = formData.get("brand") as string | null;
  const category = formData.get("category") as string | null;

  const fieldErrors: Record<string, string[]> = {};

  // Validate that file is present
  if (!file || !(file instanceof File) || file.size === 0) {
    fieldErrors.file = ["A media file is required."];
  } else {
    // Validate file size and format
    const fileValidation = portfolioFileSchema.safeParse({
      size: file.size,
      type: file.type,
    });

    if (!fileValidation.success) {
      const fileIssues: string[] = [];
      for (const issue of fileValidation.error.issues) {
        fileIssues.push(issue.message);
      }
      fieldErrors.file = fileIssues;
    }
  }

  // Validate text fields using the schema (mediaUrl and mediaType will be set after file save)
  const textValidation = createPortfolioItemSchema.safeParse({
    title: title ?? "",
    mediaUrl: "https://placeholder.local/temp", // placeholder; real URL set after file save
    mediaType: file && file.type ? (file.type.startsWith("video/") ? "video" : "image") : "image",
    brand: brand ?? "",
    category: category ?? "",
  });

  if (!textValidation.success) {
    for (const issue of textValidation.error.issues) {
      const field = issue.path[0]?.toString() ?? "form";
      // Skip mediaUrl validation errors since we used a placeholder
      if (field === "mediaUrl") continue;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    }
  }

  // Return all validation errors at once
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the errors below and try again.",
      fieldErrors,
    };
  }

  // Save the file and get the URL
  let mediaUrl: string;
  try {
    mediaUrl = await saveUploadedFile(file!);
  } catch (error) {
    console.error("[Action] Failed to save uploaded file:", error);
    return {
      success: false,
      error: "Failed to save the uploaded file. Please try again.",
    };
  }

  // Determine media type from MIME type
  const mediaType = getMediaTypeFromMime(file!.type);

  try {
    const item = await prisma.portfolioItem.create({
      data: {
        title: textValidation.data!.title,
        mediaUrl,
        mediaType,
        brand: textValidation.data!.brand,
        category: textValidation.data!.category,
        active: true,
      },
    });

    revalidatePath("/dashboard/portfolio");
    revalidatePath("/collaborations");

    return {
      success: true,
      data: { id: item.id },
    };
  } catch (error) {
    console.error("[Action] Failed to create portfolio item:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Update an existing portfolio item.
 *
 * Accepts an item ID and FormData with optional fields to update.
 * If a new file is provided, validates size/format and saves it.
 *
 * @param id - The portfolio item ID to update
 * @param formData - The form data with updated fields
 * @returns ActionResult indicating success or error
 */
export async function updatePortfolioItem(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "A valid portfolio item ID is required." };
  }

  // Check that the item exists
  const existing = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Portfolio item not found." };
  }

  const title = formData.get("title") as string | null;
  const file = formData.get("file") as File | null;
  const brand = formData.get("brand") as string | null;
  const category = formData.get("category") as string | null;

  const fieldErrors: Record<string, string[]> = {};
  const updateData: Record<string, unknown> = {};

  // Handle file upload if a new file is provided
  if (file && file instanceof File && file.size > 0) {
    const fileValidation = portfolioFileSchema.safeParse({
      size: file.size,
      type: file.type,
    });

    if (!fileValidation.success) {
      const fileIssues: string[] = [];
      for (const issue of fileValidation.error.issues) {
        fileIssues.push(issue.message);
      }
      fieldErrors.file = fileIssues;
    } else {
      try {
        const mediaUrl = await saveUploadedFile(file);
        updateData.mediaUrl = mediaUrl;
        updateData.mediaType = getMediaTypeFromMime(file.type);
      } catch (error) {
        console.error("[Action] Failed to save uploaded file:", error);
        return {
          success: false,
          error: "Failed to save the uploaded file. Please try again.",
        };
      }
    }
  }

  // Collect optional text fields for validation
  const dataToValidate: Record<string, string> = {};
  if (title !== null && title !== "") {
    dataToValidate.title = title;
  }
  if (brand !== null && brand !== "") {
    dataToValidate.brand = brand;
  }
  if (category !== null && category !== "") {
    dataToValidate.category = category;
  }

  // Validate text fields
  if (Object.keys(dataToValidate).length > 0) {
    const validation = updatePortfolioItemSchema.safeParse(dataToValidate);

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      }
    } else {
      if (validation.data.title !== undefined) updateData.title = validation.data.title;
      if (validation.data.brand !== undefined) updateData.brand = validation.data.brand;
      if (validation.data.category !== undefined) updateData.category = validation.data.category;
    }
  }

  // Return all validation errors at once
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please fix the errors below and try again.",
      fieldErrors,
    };
  }

  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      error: "No fields to update were provided.",
    };
  }

  try {
    await prisma.portfolioItem.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/portfolio");
    revalidatePath("/collaborations");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to update portfolio item:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Permanently delete a portfolio item from the database.
 *
 * @param id - The portfolio item ID to delete
 * @returns ActionResult indicating success or error
 */
export async function deletePortfolioItem(
  id: string
): Promise<ActionResult<void>> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "A valid portfolio item ID is required." };
  }

  try {
    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Portfolio item not found." };
    }

    await prisma.portfolioItem.delete({ where: { id } });

    revalidatePath("/dashboard/portfolio");
    revalidatePath("/collaborations");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to delete portfolio item:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Toggle the active/inactive status of a portfolio item.
 *
 * When toggled to inactive, the item is hidden from the public site
 * but remains in the database with all data intact.
 *
 * @param id - The portfolio item ID to toggle
 * @param active - The new active status (true = visible on public site)
 * @returns ActionResult indicating success or error
 */
export async function togglePortfolioItemStatus(
  id: string,
  active: boolean
): Promise<ActionResult<void>> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "A valid portfolio item ID is required." };
  }

  if (typeof active !== "boolean") {
    return { success: false, error: "Active status must be a boolean value." };
  }

  try {
    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Portfolio item not found." };
    }

    await prisma.portfolioItem.update({
      where: { id },
      data: { active },
    });

    revalidatePath("/dashboard/portfolio");
    revalidatePath("/collaborations");

    return { success: true };
  } catch (error) {
    console.error("[Action] Failed to toggle portfolio item status:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
