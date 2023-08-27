/* import { NextApiHandler } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
// import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

const options: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
}; */

import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = async (req, res) => {
  try {
    return await NextAuth(req, res, options);
  } catch (error) {
    console.error("NextAuth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log("Session callback triggered!");
      console.log("User:", user);
      console.log("Token:", token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT callback triggered!");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      console.log("Token: ", token);
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
};

export default authHandler;
