/* import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
} */

import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  try {
    const { postId, content } = req.body;
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

    if (!postId || !content) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: user.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
}
