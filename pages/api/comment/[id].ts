import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const postId = req.query.id?.toString();

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId as string,
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
