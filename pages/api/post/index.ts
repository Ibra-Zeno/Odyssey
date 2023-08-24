/* import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
} */
import { NextApiRequest, NextApiResponse } from "next/types";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Input validation
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    // Authentication
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "You are not authorized." });
    }

    // Create post
    const userEmail = session?.user?.email || "";
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content || null,
        author: { connect: { email: userEmail } },
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
