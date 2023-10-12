import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextAuth, { SessionStrategy } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const options = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      id: "demo",
      name: "Demo",
      credentials: {
        demoLogin: { label: "Demo Login", type: "hidden" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: {
            email: "demo@example.com",
          },
        });
        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    return await NextAuth(req, res, options);
  } catch (error) {
    console.error("NextAuth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default authHandler;
