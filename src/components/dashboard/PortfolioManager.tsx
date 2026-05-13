"use client";

import { useState, useTransition } from "react";
import { truncateTitle } from "@/lib/utils";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  togglePortfolioItemStatus,
} from "@/actions/portfolio";
import { useRouter } from "next/navigation";
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/validators";

interface PortfolioItem {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  brand: string;
  category: string;
  active: boolean;
  sortOrder: number;
  createdAt: string | Date;
}

interface PortfolioManagerProps {
  items: PortfolioItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type FormMode = "idle" | "add" | "edit";

interface FormErrors {
  title?: string[];
  mediaUrl?: string[];
  mediaType?: string[];
  brand?: string[];
  category?: string[];
  file?: string[];
  form?: string[];
}

export function PortfolioManager({
  items,
  currentPage,
  totalPages,
  totalCount,
}: PortfolioManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formMode, setFormMode] = useState<FormMode>("idle");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function clearMessages() {
    setErrors({});
    setSuccessMessage(null);
  }

  function handleOpenAdd() {
    clearMessages();
    setFormMode("add");
    setEditingItem(null);
    setSelectedFile(null);
  }

  function handleOpenEdit(item: PortfolioItem) {
    clearMessages();
    setFormMode("edit");
    setEditingItem(item);
    setSelectedFile(null);
  }

  function handleCancel() {
    setFormMode("idle");
    setEditingItem(null);
    clearMessages();
    setSelectedFile(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    // Client-side file validation
    if (file) {
      const fileErrors: string[] = [];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        fileErrors.push("File size must not exceed 50 MB");
      }
      if (!ACCEPTED_MIME_TYPES.includes(file.type as typeof ACCEPTED_MIME_TYPES[number])) {
        fileErrors.push("Accepted formats are JPEG, PNG, GIF, MP4, and MOV");
      }
      if (fileErrors.length > 0) {
        setErrors((prev) => ({ ...prev, file: fileErrors }));
      } else {
        setErrors((prev) => {
          const { file: _, ...rest } = prev;
          return rest;
        });
      }
    }
  }

  async function handleSubmitAdd(formData: FormData) {
    clearMessages();

    // Client-side file validation
    if (selectedFile) {
      const fileErrors: string[] = [];
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        fileErrors.push("File size must not exceed 50 MB");
      }
      if (!ACCEPTED_MIME_TYPES.includes(selectedFile.type as typeof ACCEPTED_MIME_TYPES[number])) {
        fileErrors.push("Accepted formats are JPEG, PNG, GIF, MP4, and MOV");
      }
      if (fileErrors.length > 0) {
        setErrors({ file: fileErrors });
        return;
      }

      // Determine media type from file
      const isVideo = selectedFile.type.startsWith("video/");
      formData.set("mediaType", isVideo ? "video" : "image");
      // In a real app, you'd upload the file and get a URL back.
      // For now, use a placeholder URL based on the file name.
      formData.set("mediaUrl", `/uploads/${selectedFile.name}`);
    } else if (!formData.get("mediaUrl")) {
      setErrors({ file: ["Please select a file to upload"] });
      return;
    }

    startTransition(async () => {
      const result = await createPortfolioItem(formData);
      if (result.success) {
        setSuccessMessage("Portfolio item created successfully.");
        setFormMode("idle");
        setSelectedFile(null);
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? { form: [result.error ?? "Unknown error"] });
      }
    });
  }

  async function handleSubmitEdit(formData: FormData) {
    if (!editingItem) return;
    clearMessages();

    // Handle file change during edit
    if (selectedFile) {
      const fileErrors: string[] = [];
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        fileErrors.push("File size must not exceed 50 MB");
      }
      if (!ACCEPTED_MIME_TYPES.includes(selectedFile.type as typeof ACCEPTED_MIME_TYPES[number])) {
        fileErrors.push("Accepted formats are JPEG, PNG, GIF, MP4, and MOV");
      }
      if (fileErrors.length > 0) {
        setErrors({ file: fileErrors });
        return;
      }

      const isVideo = selectedFile.type.startsWith("video/");
      formData.set("mediaType", isVideo ? "video" : "image");
      formData.set("mediaUrl", `/uploads/${selectedFile.name}`);
    }

    startTransition(async () => {
      const result = await updatePortfolioItem(editingItem.id, formData);
      if (result.success) {
        setSuccessMessage("Portfolio item updated successfully.");
        setFormMode("idle");
        setEditingItem(null);
        setSelectedFile(null);
        router.refresh();
      } else {
        setErrors(result.fieldErrors ?? { form: [result.error ?? "Unknown error"] });
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deletePortfolioItem(id);
      if (result.success) {
        setSuccessMessage("Portfolio item deleted.");
        setDeleteConfirmId(null);
        router.refresh();
      } else {
        setErrors({ form: [result.error ?? "Failed to delete item."] });
        setDeleteConfirmId(null);
      }
    });
  }

  async function handleToggleStatus(id: string, currentActive: boolean) {
    startTransition(async () => {
      const result = await togglePortfolioItemStatus(id, !currentActive);
      if (result.success) {
        router.refresh();
      } else {
        setErrors({ form: [result.error ?? "Failed to toggle status."] });
      }
    });
  }

  function handlePageChange(page: number) {
    router.push(`/dashboard/portfolio?page=${page}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cabernet tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} item{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>
        {formMode === "idle" && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-maroon to-cabernet text-white text-sm font-semibold rounded-[10px] min-h-[48px] tracking-[0.5px] transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(128,0,32,0.3)] hover:brightness-110 active:scale-[0.97] shine-overlay"
          >
            <PlusIcon className="w-4 h-4" />
            Add Item
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Form-level Errors */}
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.form.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {formMode !== "idle" && (
        <PortfolioForm
          mode={formMode}
          item={editingItem}
          errors={errors}
          isPending={isPending}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onSubmit={formMode === "add" ? handleSubmitAdd : handleSubmitEdit}
          onCancel={handleCancel}
        />
      )}

      {/* Portfolio Items Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">
              No portfolio items yet. Add your first item to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Thumbnail
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Brand
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.mediaType === "IMAGE" ? (
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cabernet/10">
                            <VideoIcon className="w-5 h-5 text-cabernet" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title (truncated to 80 chars) */}
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium" title={item.title}>
                        {truncateTitle(item.title, 80)}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {item.category}
                      </span>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 text-gray-600">{item.brand}</td>

                    {/* Active Status */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.active)}
                        disabled={isPending}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50 ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}
                        aria-label={`Toggle ${item.title} to ${item.active ? "inactive" : "active"}`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-cabernet transition-colors rounded-md hover:bg-cabernet/5 disabled:opacity-50"
                          aria-label={`Edit ${item.title}`}
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Delete ${item.title}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <DeleteConfirmDialog
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}


/* ─── Portfolio Form ─── */

interface PortfolioFormProps {
  mode: "add" | "edit";
  item: PortfolioItem | null;
  errors: FormErrors;
  isPending: boolean;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

function PortfolioForm({
  mode,
  item,
  errors,
  isPending,
  selectedFile,
  onFileChange,
  onSubmit,
  onCancel,
}: PortfolioFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {mode === "add" ? "Add New Portfolio Item" : "Edit Portfolio Item"}
      </h2>

      <form action={onSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="portfolio-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="portfolio-title"
            name="title"
            type="text"
            maxLength={100}
            defaultValue={item?.title ?? ""}
            placeholder="Enter portfolio item title"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
              errors.title ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">Maximum 100 characters</p>
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="portfolio-file" className="block text-sm font-medium text-gray-700 mb-1">
            Image/Video Upload <span className="text-red-500">*</span>
          </label>
          <input
            id="portfolio-file"
            type="file"
            accept=".jpeg,.jpg,.png,.gif,.mp4,.mov"
            onChange={onFileChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cabernet/10 file:text-cabernet hover:file:bg-cabernet/20 transition-colors ${
              errors.file ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          />
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
          {errors.file && (
            <p className="mt-1 text-xs text-red-600">{errors.file[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Max 50MB. Accepted: JPEG, PNG, GIF, MP4, MOV
          </p>
        </div>

        {/* Hidden mediaUrl for edit mode when no new file is selected */}
        {mode === "edit" && item && !selectedFile && (
          <>
            <input type="hidden" name="mediaUrl" value={item.mediaUrl} />
            <input type="hidden" name="mediaType" value={item.mediaType.toLowerCase()} />
          </>
        )}

        {/* Brand */}
        <div>
          <label htmlFor="portfolio-brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            id="portfolio-brand"
            name="brand"
            type="text"
            defaultValue={item?.brand ?? ""}
            placeholder="Enter brand name"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
              errors.brand ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.brand && (
            <p className="mt-1 text-xs text-red-600">{errors.brand[0]}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="portfolio-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="portfolio-category"
            name="category"
            type="text"
            defaultValue={item?.category ?? ""}
            placeholder="e.g., Fashion, Fitness, Travel"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
              errors.category ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category[0]}</p>
          )}
        </div>

        {/* Form-level errors from server */}
        {errors.mediaUrl && (
          <p className="text-xs text-red-600">{errors.mediaUrl[0]}</p>
        )}
        {errors.mediaType && (
          <p className="text-xs text-red-600">{errors.mediaType[0]}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-maroon to-cabernet text-white text-sm font-semibold rounded-[10px] min-h-[44px] tracking-[0.5px] transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(128,0,32,0.3)] hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shine-overlay"
          >
            {isPending
              ? "Saving..."
              : mode === "add"
                ? "Add Item"
                : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Delete Confirmation Dialog ─── */

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirmDialog({ onConfirm, onCancel, isPending }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <h3
          id="delete-dialog-title"
          className="text-lg font-semibold text-gray-900"
        >
          Delete Portfolio Item
        </h3>
        <p
          id="delete-dialog-description"
          className="mt-2 text-sm text-gray-500"
        >
          Are you sure you want to permanently remove this item? This action
          cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
      />
    </svg>
  );
}
