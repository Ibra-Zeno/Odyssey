import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  try {
    const postId = req.query.id;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "asc", // Or "desc" based on your preference
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments." });
  }
}
