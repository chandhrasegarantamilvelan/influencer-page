import { Resend } from "resend";
import { prisma } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface AdminNotificationParams {
  brandName: string;
  contactEmail: string;
  collaborationType: string;
  requestId?: string;
}

function buildNotificationHtml(params: AdminNotificationParams): string {
  const { brandName, contactEmail, collaborationType } = params;
  const typeLabel = collaborationType.replace(/_/g, " ").toLowerCase();

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #D6B24C; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #540212; font-size: 24px; margin: 0;">New Collaboration Request</h1>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        A new collaboration request has been submitted. Here are the details:
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 12px 16px; background-color: #f9f5f0; border-left: 3px solid #800020; font-weight: 600; color: #540212;">Brand Name</td>
          <td style="padding: 12px 16px; background-color: #f9f5f0;">${brandName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border-left: 3px solid #800020; font-weight: 600; color: #540212;">Contact Email</td>
          <td style="padding: 12px 16px;">${contactEmail}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background-color: #f9f5f0; border-left: 3px solid #800020; font-weight: 600; color: #540212;">Collaboration Type</td>
          <td style="padding: 12px 16px; background-color: #f9f5f0; text-transform: capitalize;">${typeLabel}</td>
        </tr>
      </table>
      <p style="color: #666; font-size: 14px; margin-top: 32px;">
        Log in to your dashboard to review and respond to this request.
      </p>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        This is an automated notification from your portfolio site.
      </div>
    </div>
  `;
}

/**
 * Sends an admin notification email for a new collaboration request.
 * Implements retry logic with up to 3 attempts and 5-second delays.
 * Logs all attempts and outcomes to the EmailLog table.
 *
 * This function is designed to be called asynchronously (fire-and-forget)
 * so it does not block the request response.
 */
export async function sendAdminNotification(
  params: AdminNotificationParams
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("[Email] ADMIN_EMAIL environment variable is not set");
    return;
  }

  const subject = `New Collaboration Request from ${params.brandName}`;

  // Create initial EmailLog entry with PENDING status
  const emailLog = await prisma.emailLog.create({
    data: {
      recipientEmail: adminEmail,
      subject,
      status: "PENDING",
      attempts: 0,
      requestId: params.requestId ?? null,
    },
  });

  let lastError: string | null = null;

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      console.info(
        `[Email] Attempt ${attempt}/${RETRY_ATTEMPTS} - Sending notification to ${adminEmail}`
      );

      await resend.emails.send({
        from: "Portfolio Site <onboarding@resend.dev>",
        to: adminEmail,
        subject,
        html: buildNotificationHtml(params),
      });

      // Success — update EmailLog
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: "SENT",
          attempts: attempt,
          lastError: null,
        },
      });

      console.info(`[Email] Successfully sent notification on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error(
        `[Email] Attempt ${attempt}/${RETRY_ATTEMPTS} failed: ${lastError}`
      );

      // Update attempt count in the log
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          attempts: attempt,
          lastError,
        },
      });

      // Wait before retrying (unless this was the last attempt)
      if (attempt < RETRY_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  // All retries exhausted — mark as FAILED
  await prisma.emailLog.update({
    where: { id: emailLog.id },
    data: {
      status: "FAILED",
      lastError,
    },
  });

  console.error(
    `[Email] All ${RETRY_ATTEMPTS} attempts failed for notification to ${adminEmail}. Email marked as FAILED.`
  );
}
