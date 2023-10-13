// api/search.ts
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { q } = req.query;

  try {
    if (!q) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // Sanitize the input to prevent potential SQL injection
    let sanitizedQuery = "";
    if (typeof q === "string") {
      sanitizedQuery = q.trim();
    } else if (Array.isArray(q)) {
      sanitizedQuery = q[0].trim();
    }

    const searchResults = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { content: { contains: sanitizedQuery, mode: "insensitive" } },
        ],
        AND: [{ published: true }],
      },
      // take: 10, // Limit the number of results per page
    });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "An error occurred while searching posts." });
  }
}
