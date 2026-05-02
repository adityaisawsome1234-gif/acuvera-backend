import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    orgs?: Array<{ id: string; name: string }>;
    userId?: string;
    user?: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    orgs?: Array<{ id: string; name: string }>;
    userId?: string;
  }
}
