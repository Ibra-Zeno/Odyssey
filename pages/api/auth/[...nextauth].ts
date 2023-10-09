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

/* CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "demopassword",
        },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined,
        req: Pick<NextApiRequest, "body" | "headers" | "method">,
      ): Promise<User | null> {
        // Check if the provided credentials match your demo account
        if (
          credentials?.username === "demo" &&
          credentials?.password === "demopassword"
        ) {
          // Return a user object for the demo account
          return Promise.resolve({
            id: 1,
            name: "Demo User",
            email: "demo@example.com",
          });
        }

        // Return null if the credentials are invalid
        return Promise.resolve(null);
      },
    }), */
