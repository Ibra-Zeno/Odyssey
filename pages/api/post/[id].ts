import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const postId = req.query.id;
  if (req.method === "DELETE") {
    const postId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else if (req.method === "GET") {
    const postId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        tags: {
          include: { tag: true },
        },
      },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
