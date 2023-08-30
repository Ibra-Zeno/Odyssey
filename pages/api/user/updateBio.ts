import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../../../pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getServerSession(req, res, options);
  const email = session?.user?.email;
  const { bio } = req.body;

  try {
    await prisma.user.update({
      where: { email: email },
      data: { bio: bio },
    });
    return res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
    console.error("Error updating bio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
