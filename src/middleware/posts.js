import prisma from "#/db.js";

export async function loadPost(req, res, next) {
  const id = Number(req.params.id);

  // Validity check first before db request
  if (typeof id !== "number" || Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  const post = await prisma.posts.findUnique({
    where: { id },
  });

  // If post doesn't exist, explicitly return error rather than having Prisma handle it
  if (!post) return res.status(404).json({ error: "Not Found" });

  req.post = post;

  return next();
}
