import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";
import { sanitizeContent } from "../../../utils/sanitizeUtil";

export default async function handle(req, res) {
  try {
    // Input validation
    const { title, content } = req.body;
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
    // Create post using the user's ID
    const result = await prisma.post.create({
      data: {
        title: title,
        content: sanitizedContent || null,
        authorId: user.id,
      },
    });

    // Respond with success
    res
      .status(201)
      .json({ message: "Post created successfully.", post: result });
  } catch (error) {
    // Error handling
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
}
