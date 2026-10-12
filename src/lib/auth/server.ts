import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { Pool } from "pg";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function resolveBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function allowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAIL ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function assertAllowlistedAdmin(email: string | null | undefined, emailVerified?: boolean | null) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized || emailVerified !== true || !allowedAdminEmails().has(normalized)) {
    throw new APIError("FORBIDDEN", {
      message: "This account is not authorized.",
    });
  }
}

function createAuth() {
  const secret = requireEnv("BETTER_AUTH_SECRET");
  const authDatabaseUrl = requireEnv("AUTH_DATABASE_URL");
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    console.warn(
      "[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing — Google login will fail until set.",
    );
  }

  return betterAuth({
    secret,
    baseURL: resolveBaseURL(),
    database: new Pool({
      connectionString: authDatabaseUrl,
      ssl: { rejectUnauthorized: true },
      max: 5,
    }),
    // Map Better Auth camelCase fields → our snake_case Postgres columns
    user: {
      fields: {
        emailVerified: "email_verified",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    session: {
      fields: {
        expiresAt: "expires_at",
        createdAt: "created_at",
        updatedAt: "updated_at",
        ipAddress: "ip_address",
        userAgent: "user_agent",
        userId: "user_id",
      },
    },
    account: {
      fields: {
        accountId: "account_id",
        providerId: "provider_id",
        userId: "user_id",
        accessToken: "access_token",
        refreshToken: "refresh_token",
        idToken: "id_token",
        accessTokenExpiresAt: "access_token_expires_at",
        refreshTokenExpiresAt: "refresh_token_expires_at",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    verification: {
      fields: {
        expiresAt: "expires_at",
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      google: {
        clientId: googleClientId || "missing-google-client-id",
        clientSecret: googleClientSecret || "missing-google-client-secret",
        prompt: "select_account",
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const email = user.email?.trim().toLowerCase();
            if (!email || !allowedAdminEmails().has(email)) {
              throw new APIError("FORBIDDEN", {
                message: "This account is not authorized.",
              });
            }
            return { data: user };
          },
        },
      },
      session: {
        create: {
          before: async (session, ctx) => {
            if (!ctx) {
              throw new APIError("FORBIDDEN", {
                message: "This account is not authorized.",
              });
            }
            const user = await ctx.context.internalAdapter.findUserById(session.userId);
            assertAllowlistedAdmin(user?.email, user?.emailVerified);
          },
        },
      },
    },
    trustedOrigins: [
      "http://localhost:3000",
      "https://charisiss.gr",
      "https://www.charisiss.gr",
    ],
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;

let cached: Auth | null = null;

export function getAuth() {
  if (!cached) cached = createAuth();
  return cached;
}

export const auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    const instance = getAuth() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  has(_target, prop) {
    return prop in getAuth();
  },
});
