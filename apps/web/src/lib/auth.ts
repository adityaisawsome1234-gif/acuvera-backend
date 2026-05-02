import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Use NEXT_PUBLIC_API_BASE_URL - must be set in production
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is required");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          return null;
        }
        const data = await response.json();
        if (!data?.access_token || !data?.user) {
          return null;
        }
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          accessToken: data.access_token,
          orgs: data.user.orgs ?? [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.accessToken = (user as any).accessToken;
        token.orgs = (user as any).orgs ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).userId = token.userId;
      (session as any).accessToken = token.accessToken;
      (session as any).orgs = token.orgs ?? [];
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
