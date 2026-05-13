import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Account lockout constants
 */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15-minute window for tracking failures

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !email ||
          !password
        ) {
          throw new Error("Invalid credentials");
        }

        // Find admin by email
        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin) {
          throw new Error("Invalid credentials");
        }

        // Check if account is currently locked
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          throw new Error("Account temporarily locked");
        }

        // If lockout has expired, reset the failed attempts
        if (admin.lockedUntil && admin.lockedUntil <= new Date()) {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedAttempts: 0, lockedUntil: null },
          });
          // Refresh admin data after reset
          admin.failedAttempts = 0;
          admin.lockedUntil = null;
        }

        // Verify password
        const isValidPassword = await compare(password, admin.hashedPassword);

        if (!isValidPassword) {
          // Increment failed attempts
          const newFailedAttempts = admin.failedAttempts + 1;

          const updateData: { failedAttempts: number; lockedUntil?: Date } = {
            failedAttempts: newFailedAttempts,
          };

          // Lock account if threshold reached
          if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
            updateData.lockedUntil = new Date(
              Date.now() + LOCKOUT_DURATION_MS
            );
          }

          await prisma.admin.update({
            where: { id: admin.id },
            data: updateData,
          });

          if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
            throw new Error("Account temporarily locked");
          }

          throw new Error("Invalid credentials");
        }

        // Successful login: reset failed attempts and update lastLoginAt
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: admin.id,
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600, // 60 minutes
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
