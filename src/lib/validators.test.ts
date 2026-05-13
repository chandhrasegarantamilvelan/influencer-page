import { describe, it, expect } from 'vitest';
import {
  collaborationRequestSchema,
  createPortfolioItemSchema,
  updatePortfolioItemSchema,
  portfolioFileSchema,
  createSocialProfileSchema,
  updateSocialProfileSchema,
  loginCredentialsSchema,
  MAX_FILE_SIZE_BYTES,
} from './validators';

// --- Helpers ---

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// --- Collaboration Request Schema ---

describe('collaborationRequestSchema', () => {
  const validRequest = {
    brandName: 'Acme Corp',
    contactName: 'Jane Doe',
    contactEmail: 'jane@acme.com',
    collaborationType: 'sponsored_post' as const,
    budgetRange: 'under_500' as const,
    startDate: futureDate(1),
    endDate: futureDate(7),
    description: 'A great campaign idea.',
  };

  it('accepts a valid collaboration request', () => {
    const result = collaborationRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('rejects when brandName exceeds 100 characters', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      brandName: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects when contactName exceeds 100 characters', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      contactName: 'B'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email format', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      contactEmail: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty email', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      contactEmail: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid collaboration type', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      collaborationType: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid budget range', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      budgetRange: 'million_dollars',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a start date in the past', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      startDate: '2020-01-01',
      endDate: futureDate(7),
    });
    expect(result.success).toBe(false);
  });

  it('rejects when end date is before start date', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      startDate: futureDate(7),
      endDate: futureDate(1),
    });
    expect(result.success).toBe(false);
  });

  it('accepts when start date equals today', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      startDate: todayISO(),
      endDate: futureDate(7),
    });
    expect(result.success).toBe(true);
  });

  it('accepts when end date equals start date', () => {
    const start = futureDate(3);
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      startDate: start,
      endDate: start,
    });
    expect(result.success).toBe(true);
  });

  it('rejects description exceeding 1000 characters', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      description: 'X'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid date format', () => {
    const result = collaborationRequestSchema.safeParse({
      ...validRequest,
      startDate: '01-01-2026',
    });
    expect(result.success).toBe(false);
  });
});

// --- Portfolio Item Schemas ---

describe('createPortfolioItemSchema', () => {
  const validItem = {
    title: 'My Portfolio Piece',
    mediaUrl: 'https://example.com/image.jpg',
    mediaType: 'image' as const,
    brand: 'Nike',
    category: 'Fashion',
  };

  it('accepts a valid portfolio item', () => {
    const result = createPortfolioItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('rejects when title exceeds 100 characters', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      title: 'T'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty title', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid media URL', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      mediaUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid media type', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      mediaType: 'audio',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when brand is empty', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      brand: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when category is empty', () => {
    const result = createPortfolioItemSchema.safeParse({
      ...validItem,
      category: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('updatePortfolioItemSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    const result = updatePortfolioItemSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts a partial update with only title', () => {
    const result = updatePortfolioItemSchema.safeParse({ title: 'New Title' });
    expect(result.success).toBe(true);
  });

  it('rejects title exceeding 100 characters when provided', () => {
    const result = updatePortfolioItemSchema.safeParse({
      title: 'T'.repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// --- Portfolio File Schema ---

describe('portfolioFileSchema', () => {
  it('accepts a valid JPEG file under 50MB', () => {
    const result = portfolioFileSchema.safeParse({
      size: 1024 * 1024, // 1 MB
      type: 'image/jpeg',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid MP4 file at exactly 50MB', () => {
    const result = portfolioFileSchema.safeParse({
      size: MAX_FILE_SIZE_BYTES,
      type: 'video/mp4',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a file exceeding 50MB', () => {
    const result = portfolioFileSchema.safeParse({
      size: MAX_FILE_SIZE_BYTES + 1,
      type: 'image/png',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unsupported MIME type', () => {
    const result = portfolioFileSchema.safeParse({
      size: 1024,
      type: 'application/pdf',
    });
    expect(result.success).toBe(false);
  });
});

// --- Social Profile Schemas ---

describe('createSocialProfileSchema', () => {
  const validProfile = {
    platformName: 'Instagram',
    handle: '@influencer',
    profileUrl: 'https://instagram.com/influencer',
    followerCount: 150000,
  };

  it('accepts a valid social profile without optional fields', () => {
    const result = createSocialProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('accepts a valid social profile with optional bioExcerpt', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      bioExcerpt: 'Lifestyle and fitness content creator.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects when platformName is empty', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      platformName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when handle exceeds 100 characters', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      handle: 'H'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid profile URL', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      profileUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative follower count', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      followerCount: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a follower count exceeding 999,999,999', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      followerCount: 1_000_000_000,
    });
    expect(result.success).toBe(false);
  });

  it('accepts follower count at boundary 0', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      followerCount: 0,
    });
    expect(result.success).toBe(true);
  });

  it('accepts follower count at boundary 999,999,999', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      followerCount: 999_999_999,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-integer follower count', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      followerCount: 1500.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects bioExcerpt exceeding 300 characters', () => {
    const result = createSocialProfileSchema.safeParse({
      ...validProfile,
      bioExcerpt: 'B'.repeat(301),
    });
    expect(result.success).toBe(false);
  });
});

describe('updateSocialProfileSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    const result = updateSocialProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts a partial update with only followerCount', () => {
    const result = updateSocialProfileSchema.safeParse({
      followerCount: 200000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects follower count over max when provided', () => {
    const result = updateSocialProfileSchema.safeParse({
      followerCount: 1_000_000_000,
    });
    expect(result.success).toBe(false);
  });
});

// --- Login Credentials Schema ---

describe('loginCredentialsSchema', () => {
  it('accepts valid login credentials', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'admin@example.com',
      password: 'securepass123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty email', () => {
    const result = loginCredentialsSchema.safeParse({
      email: '',
      password: 'securepass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email format', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'not-an-email',
      password: 'securepass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects email exceeding 254 characters', () => {
    const longEmail = 'a'.repeat(246) + '@test.com'; // 255 chars
    const result = loginCredentialsSchema.safeParse({
      email: longEmail,
      password: 'securepass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'admin@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password exceeding 128 characters', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'admin@example.com',
      password: 'P'.repeat(129),
    });
    expect(result.success).toBe(false);
  });

  it('accepts password at minimum length (8 characters)', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'admin@example.com',
      password: '12345678',
    });
    expect(result.success).toBe(true);
  });

  it('accepts password at maximum length (128 characters)', () => {
    const result = loginCredentialsSchema.safeParse({
      email: 'admin@example.com',
      password: 'P'.repeat(128),
    });
    expect(result.success).toBe(true);
  });
});
