import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";
import { sanitizeContent } from "../../../utils/sanitizeUtil";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    // Input validation
    const { title, content, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    // Get user session from server-side
    const session = await getServerSession(req, res, options);

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const sanitizedContent = sanitizeContent(content);

    // Get current tags of the post
    const currentPost = await prisma.post.findUnique({
      where: { id: String(id) },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!currentPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    const currentTagId = currentPost.tags.map((t) => t.tag.id);

    const tagsToDisconnect = currentTagId.filter(
      (tagName) => !tags.includes(tagName),
    );
    const tagsToConnect = tags.filter(
      (tagName: string) => !currentTagId.includes(tagName),
    );

    // Update post
    await prisma.post.update({
      where: { id: String(id) },
      data: {
        title: title,
        content: sanitizedContent,
        tags: {
          deleteMany: {},
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
    });

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    // Error handling
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
}
