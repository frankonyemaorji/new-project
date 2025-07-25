import NextAuth from "next-auth";

// types/next-auth.d.ts

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      image: undefined;
      id: string
      email: string
      name: string
      username?: string
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    username?: string
    role: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    username?: string
    accessToken?: string
    refreshToken?: string
  }
}