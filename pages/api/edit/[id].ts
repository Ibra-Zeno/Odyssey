import prisma from "../../../lib/prisma";

// PUT /api/edit/:id
export default async function handle(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const postId = req.query.id;
  const { title, content } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content, published: false },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating the post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
}
