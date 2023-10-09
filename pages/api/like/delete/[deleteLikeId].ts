import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const postId = req.query.deleteLikeId;
    const session = await getServerSession(req, res, options);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!postId) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    await prisma.like.deleteMany({
      where: {
        postId: postId.toString(),
        authorId: user.id,
      },
    });

    res.status(204).end(); // No content response
  } catch (error) {
    console.error("Error deleting like:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the like." });
  }
}
