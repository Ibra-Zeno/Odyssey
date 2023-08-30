import prisma from "../../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const postId = req.query.getLikes;

    if (!postId) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const likes = await prisma.like.findMany({
      where: {
        postId,
      },
    });

    res.status(200).json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "An error occurred while fetching likes." });
  }
}
