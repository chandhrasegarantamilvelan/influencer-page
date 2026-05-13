"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSocialProfile,
  updateSocialProfile,
  deleteSocialProfile,
} from "@/actions/profiles";

interface SocialProfile {
  id: string;
  platformName: string;
  handle: string;
  profileUrl: string;
  followerCount: number;
  bioExcerpt: string | null;
  iconUrl: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileFormData {
  platformName: string;
  handle: string;
  profileUrl: string;
  followerCount: string;
  bioExcerpt: string;
}

const emptyForm: ProfileFormData = {
  platformName: "",
  handle: "",
  profileUrl: "",
  followerCount: "",
  bioExcerpt: "",
};

interface ProfilesManagerProps {
  initialProfiles: SocialProfile[];
}

export function ProfilesManager({ initialProfiles }: ProfilesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ProfileFormData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function resetForm() {
    setFormData(emptyForm);
    setFieldErrors({});
    setGeneralError(null);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(profile: SocialProfile) {
    setFormData({
      platformName: profile.platformName,
      handle: profile.handle,
      profileUrl: profile.profileUrl,
      followerCount: profile.followerCount.toString(),
      bioExcerpt: profile.bioExcerpt ?? "",
    });
    setEditingId(profile.id);
    setFieldErrors({});
    setGeneralError(null);
    setShowForm(true);
  }

  function validateLocally(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (!formData.platformName.trim()) {
      errors.platformName = ["Platform name is required"];
    }

    if (!formData.handle.trim()) {
      errors.handle = ["Handle is required"];
    } else if (formData.handle.length > 100) {
      errors.handle = ["Handle must be 100 characters or fewer"];
    }

    if (!formData.profileUrl.trim()) {
      errors.profileUrl = ["Profile URL is required"];
    } else {
      try {
        new URL(formData.profileUrl);
      } catch {
        errors.profileUrl = ["Please enter a valid URL"];
      }
    }

    if (!formData.followerCount.trim()) {
      errors.followerCount = ["Follower count is required"];
    } else {
      const num = Number(formData.followerCount);
      if (!Number.isInteger(num)) {
        errors.followerCount = ["Follower count must be a whole number"];
      } else if (num < 0 || num > 999_999_999) {
        errors.followerCount = [
          "Follower count must be between 0 and 999,999,999",
        ];
      }
    }

    if (formData.bioExcerpt.length > 300) {
      errors.bioExcerpt = ["Bio excerpt must be 300 characters or fewer"];
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // Client-side validation
    const localErrors = validateLocally();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    // Build FormData for server action
    const actionFormData = new FormData();
    actionFormData.set("platformName", formData.platformName.trim());
    actionFormData.set("handle", formData.handle.trim());
    actionFormData.set("profileUrl", formData.profileUrl.trim());
    actionFormData.set("followerCount", formData.followerCount.trim());
    actionFormData.set("bioExcerpt", formData.bioExcerpt.trim());

    startTransition(async () => {
      let result;

      if (editingId) {
        result = await updateSocialProfile(editingId, actionFormData);
      } else {
        result = await createSocialProfile(actionFormData);
      }

      if (result.success) {
        resetForm();
        router.refresh();
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        if (result.error) {
          setGeneralError(result.error);
        }
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSocialProfile(id);
      if (result.success) {
        setDeleteConfirmId(null);
        router.refresh();
      } else {
        setGeneralError(result.error ?? "Failed to delete profile.");
        setDeleteConfirmId(null);
      }
    });
  }

  function formatFollowerCount(count: number): string {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  }

  return (
    <div className="space-y-6">
      {/* General error message */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {generalError}
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-maroon to-cabernet text-white text-sm font-semibold rounded-[10px] min-h-[48px] tracking-[0.5px] transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(128,0,32,0.3)] hover:brightness-110 active:scale-[0.97] shine-overlay"
        >
          <PlusIcon className="w-4 h-4" />
          Add Profile
        </button>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Profile" : "Add New Profile"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Platform Name */}
            <div>
              <label
                htmlFor="platformName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Platform Name <span className="text-red-500">*</span>
              </label>
              <input
                id="platformName"
                type="text"
                value={formData.platformName}
                onChange={(e) =>
                  setFormData({ ...formData, platformName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
                  fieldErrors.platformName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="e.g., Instagram"
              />
              {fieldErrors.platformName && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.platformName[0]}
                </p>
              )}
            </div>

            {/* Handle */}
            <div>
              <label
                htmlFor="handle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Handle <span className="text-red-500">*</span>
              </label>
              <input
                id="handle"
                type="text"
                value={formData.handle}
                onChange={(e) =>
                  setFormData({ ...formData, handle: e.target.value })
                }
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
                  fieldErrors.handle
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="e.g., @username"
              />
              <div className="flex justify-between mt-1">
                {fieldErrors.handle ? (
                  <p className="text-xs text-red-600">
                    {fieldErrors.handle[0]}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">
                  {formData.handle.length}/100
                </span>
              </div>
            </div>

            {/* Profile URL */}
            <div>
              <label
                htmlFor="profileUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                id="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, profileUrl: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
                  fieldErrors.profileUrl
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="https://instagram.com/username"
              />
              {fieldErrors.profileUrl && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.profileUrl[0]}
                </p>
              )}
            </div>

            {/* Follower Count */}
            <div>
              <label
                htmlFor="followerCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Follower Count <span className="text-red-500">*</span>
              </label>
              <input
                id="followerCount"
                type="number"
                min="0"
                max="999999999"
                value={formData.followerCount}
                onChange={(e) =>
                  setFormData({ ...formData, followerCount: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors ${
                  fieldErrors.followerCount
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="e.g., 150000"
              />
              {fieldErrors.followerCount && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.followerCount[0]}
                </p>
              )}
            </div>

            {/* Bio Excerpt */}
            <div>
              <label
                htmlFor="bioExcerpt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio Excerpt
              </label>
              <textarea
                id="bioExcerpt"
                value={formData.bioExcerpt}
                onChange={(e) =>
                  setFormData({ ...formData, bioExcerpt: e.target.value })
                }
                maxLength={300}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cabernet/20 focus:border-cabernet transition-colors resize-none ${
                  fieldErrors.bioExcerpt
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
                placeholder="Short bio or description (optional)"
              />
              <div className="flex justify-between mt-1">
                {fieldErrors.bioExcerpt ? (
                  <p className="text-xs text-red-600">
                    {fieldErrors.bioExcerpt[0]}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">
                  {formData.bioExcerpt.length}/300
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-maroon to-cabernet text-white text-sm font-semibold rounded-[10px] min-h-[48px] tracking-[0.5px] transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(128,0,32,0.3)] hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shine-overlay"
              >
                {isPending
                  ? "Saving..."
                  : editingId
                    ? "Update Profile"
                    : "Add Profile"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profiles List */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            All Profiles
          </h2>
        </div>

        {initialProfiles.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">
              No social profiles configured yet. Add your first profile above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {initialProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {profile.platformName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-600 truncate">
                      {profile.handle}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatFollowerCount(profile.followerCount)} followers
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(profile)}
                    className="px-3 py-1.5 text-xs font-medium text-cabernet hover:bg-cabernet/5 rounded-md transition-colors"
                  >
                    Edit
                  </button>

                  {deleteConfirmId === profile.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(profile.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isPending ? "..." : "Confirm"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(profile.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
