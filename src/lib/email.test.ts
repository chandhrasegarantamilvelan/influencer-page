import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockSend = vi.hoisted(() => vi.fn());

// Mock Resend before importing the module
vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

// Mock Prisma
vi.mock("./prisma", () => ({
  prisma: {
    emailLog: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { sendAdminNotification } from "./email";
import { prisma } from "./prisma";

const RETRY_DELAY_MS = 5000;

describe("sendAdminNotification", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      ADMIN_EMAIL: "admin@test.com",
      RESEND_API_KEY: "re_test_key",
    };

    // Default: prisma.emailLog.create returns an object with an id
    vi.mocked(prisma.emailLog.create).mockResolvedValue({
      id: "log-1",
      recipientEmail: "admin@test.com",
      subject: "test",
      status: "PENDING",
      attempts: 0,
      lastError: null,
      requestId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.emailLog.update).mockResolvedValue({
      id: "log-1",
      recipientEmail: "admin@test.com",
      subject: "test",
      status: "SENT",
      attempts: 1,
      lastError: null,
      requestId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should send email successfully on first attempt", async () => {
    mockSend.mockResolvedValueOnce({ id: "email-id-1" });

    await sendAdminNotification({
      brandName: "TestBrand",
      contactEmail: "brand@test.com",
      collaborationType: "SPONSORED_POST",
      requestId: "req-1",
    });

    // Should create an EmailLog entry
    expect(prisma.emailLog.create).toHaveBeenCalledWith({
      data: {
        recipientEmail: "admin@test.com",
        subject: "New Collaboration Request from TestBrand",
        status: "PENDING",
        attempts: 0,
        requestId: "req-1",
      },
    });

    // Should call resend.emails.send
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@test.com",
        subject: "New Collaboration Request from TestBrand",
      })
    );

    // Should update EmailLog to SENT
    expect(prisma.emailLog.update).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: {
        status: "SENT",
        attempts: 1,
        lastError: null,
      },
    });
  });

  it("should retry on failure and succeed on second attempt", async () => {
    mockSend
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ id: "email-id-2" });

    vi.useFakeTimers();

    const promise = sendAdminNotification({
      brandName: "RetryBrand",
      contactEmail: "retry@test.com",
      collaborationType: "PRODUCT_REVIEW",
    });

    // Advance past the retry delay
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);
    await promise;

    vi.useRealTimers();

    // Should have attempted twice
    expect(mockSend).toHaveBeenCalledTimes(2);

    // Final update should mark as SENT with 2 attempts
    expect(prisma.emailLog.update).toHaveBeenCalledWith({
      where: { id: "log-1" },
      data: {
        status: "SENT",
        attempts: 2,
        lastError: null,
      },
    });
  });

  it("should mark as FAILED after 3 failed attempts", async () => {
    mockSend
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockRejectedValueOnce(new Error("Fail 3"));

    vi.useFakeTimers();

    const promise = sendAdminNotification({
      brandName: "FailBrand",
      contactEmail: "fail@test.com",
      collaborationType: "GIVEAWAY",
      requestId: "req-fail",
    });

    // Advance past both retry delays
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);
    await vi.advanceTimersByTimeAsync(RETRY_DELAY_MS);
    await promise;

    vi.useRealTimers();

    // Should have attempted 3 times
    expect(mockSend).toHaveBeenCalledTimes(3);

    // Final update should mark as FAILED
    expect(prisma.emailLog.update).toHaveBeenLastCalledWith({
      where: { id: "log-1" },
      data: {
        status: "FAILED",
        lastError: "Fail 3",
      },
    });
  });

  it("should not send email if ADMIN_EMAIL is not set", async () => {
    delete process.env.ADMIN_EMAIL;

    await sendAdminNotification({
      brandName: "NoBrand",
      contactEmail: "no@test.com",
      collaborationType: "OTHER",
    });

    expect(mockSend).not.toHaveBeenCalled();
    expect(prisma.emailLog.create).not.toHaveBeenCalled();
  });

  it("should include brand name, contact email, and collaboration type in email HTML", async () => {
    mockSend.mockResolvedValueOnce({ id: "email-id-3" });

    await sendAdminNotification({
      brandName: "LuxuryBrand",
      contactEmail: "luxury@brand.com",
      collaborationType: "BRAND_AMBASSADOR",
    });

    const sentHtml = mockSend.mock.calls[0][0].html as string;
    expect(sentHtml).toContain("LuxuryBrand");
    expect(sentHtml).toContain("luxury@brand.com");
    expect(sentHtml).toContain("brand ambassador");
  });
});
