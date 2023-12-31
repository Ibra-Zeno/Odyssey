import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const deleteCommentId = req.query.deleteCommentId;

  try {
    // Get user session from server-side
    const session = await getServerSession(req, res, options);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    if (!deleteCommentId) {
      return res.status(400).json({ error: "Comment ID is required." });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: deleteCommentId.toString(),
      },
      include: {
        author: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (!comment.author || comment.author.email !== session.user.email) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment." });
    }

    await prisma.comment.delete({
      where: {
        id: deleteCommentId.toString(),
      },
    });

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment." });
  }
}
