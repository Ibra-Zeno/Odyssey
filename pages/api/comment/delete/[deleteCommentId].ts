import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";

export default async function handle(req, res) {
  const deleteCommentId = req.query.deleteCommentId;

  try {
    // Get user session from server-side
    const session = await getServerSession(req, res, options);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: deleteCommentId,
      },
      include: {
        author: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.author.email !== session.user.email) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment." });
    }

    await prisma.comment.delete({
      where: {
        id: deleteCommentId,
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
