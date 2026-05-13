import { z } from 'zod';

// --- Enums ---

export const collaborationTypeSchema = z.enum([
  'sponsored_post',
  'product_review',
  'brand_ambassador',
  'giveaway',
  'event_appearance',
  'other',
]);

export const budgetRangeSchema = z.enum([
  'under_500',
  '500_1000',
  '1000_5000',
  '5000_10000',
  'over_10000',
]);

export const mediaTypeSchema = z.enum(['image', 'video']);

// --- Accepted file formats for portfolio uploads ---

export const ACCEPTED_MEDIA_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.mp4',
  '.mov',
] as const;

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime',
] as const;

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// --- Collaboration Request Form ---

export const collaborationRequestSchema = z
  .object({
    brandName: z
      .string()
      .min(1, 'Brand name is required')
      .max(100, 'Brand name must be 100 characters or fewer'),
    contactName: z
      .string()
      .min(1, 'Contact name is required')
      .max(100, 'Contact name must be 100 characters or fewer'),
    contactEmail: z
      .string()
      .min(1, 'Contact email is required')
      .email('Please enter a valid email address'),
    collaborationType: collaborationTypeSchema,
    budgetRange: budgetRangeSchema,
    startDate: z.string().date('Start date must be a valid date (YYYY-MM-DD)'),
    endDate: z.string().date('End date must be a valid date (YYYY-MM-DD)'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description must be 1,000 characters or fewer'),
  })
  .refine(
    (data) => {
      const today = new Date().toISOString().split('T')[0];
      return data.startDate >= today;
    },
    { message: 'Start date must be today or later', path: ['startDate'] },
  )
  .refine(
    (data) => {
      return data.endDate >= data.startDate;
    },
    { message: 'End date must be on or after the start date', path: ['endDate'] },
  );

// --- Portfolio Item Creation ---

export const createPortfolioItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  mediaUrl: z
    .string()
    .min(1, 'Media URL is required')
    .url('Please enter a valid URL'),
  mediaType: mediaTypeSchema,
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
});

// --- Portfolio Item Update (all fields optional) ---

export const updatePortfolioItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer')
    .optional(),
  mediaUrl: z
    .string()
    .min(1, 'Media URL is required')
    .url('Please enter a valid URL')
    .optional(),
  mediaType: mediaTypeSchema.optional(),
  brand: z.string().min(1, 'Brand is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
});

// --- Portfolio File Validation ---

export const portfolioFileSchema = z.object({
  size: z
    .number()
    .max(MAX_FILE_SIZE_BYTES, 'File size must not exceed 50 MB'),
  type: z.enum(ACCEPTED_MIME_TYPES, {
    message:
      'Accepted formats are JPEG, PNG, GIF, MP4, and MOV',
  }),
});

// --- Social Profile Creation ---

export const createSocialProfileSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  handle: z
    .string()
    .min(1, 'Handle is required')
    .max(100, 'Handle must be 100 characters or fewer'),
  profileUrl: z
    .string()
    .min(1, 'Profile URL is required')
    .url('Please enter a valid URL'),
  followerCount: z
    .number({ message: 'Follower count must be a number' })
    .int('Follower count must be a whole number')
    .min(0, 'Follower count must be at least 0')
    .max(999_999_999, 'Follower count must be 999,999,999 or fewer'),
  bioExcerpt: z
    .string()
    .max(300, 'Bio excerpt must be 300 characters or fewer')
    .optional(),
  iconUrl: z.string().url('Please enter a valid icon URL').optional(),
});

// --- Social Profile Update (all fields optional) ---

export const updateSocialProfileSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required').optional(),
  handle: z
    .string()
    .min(1, 'Handle is required')
    .max(100, 'Handle must be 100 characters or fewer')
    .optional(),
  profileUrl: z
    .string()
    .min(1, 'Profile URL is required')
    .url('Please enter a valid URL')
    .optional(),
  followerCount: z
    .number({ message: 'Follower count must be a number' })
    .int('Follower count must be a whole number')
    .min(0, 'Follower count must be at least 0')
    .max(999_999_999, 'Follower count must be 999,999,999 or fewer')
    .optional(),
  bioExcerpt: z
    .string()
    .max(300, 'Bio excerpt must be 300 characters or fewer')
    .optional(),
  iconUrl: z.string().url('Please enter a valid icon URL').optional(),
});

// --- Login Credentials ---

export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Email must be 254 characters or fewer')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or fewer'),
});

// --- Inferred Types ---

export type CollaborationRequestInput = z.infer<typeof collaborationRequestSchema>;
export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>;
export type UpdatePortfolioItemInput = z.infer<typeof updatePortfolioItemSchema>;
export type PortfolioFileInput = z.infer<typeof portfolioFileSchema>;
export type CreateSocialProfileInput = z.infer<typeof createSocialProfileSchema>;
export type UpdateSocialProfileInput = z.infer<typeof updateSocialProfileSchema>;
export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>;
