import express from "express";
import prisma from "#/db.js";

const router = express.Router();

// Create new post
router.post("/", async (req, res, next) => {
  // Check body exists
  if (!req.body || typeof req.body !== "object") {
    return res.status(404).json({ error: "Body required" });
  }

  const { authorId, content } = req.body;

  const authorIdNum = Number(authorId);

  if (typeof authorIdNum !== "number" || typeof content !== "string") {
    return res.status(404).json({ error: "Invalid authorId or content types" });
  }

  const post = await prisma.posts.create({
    data: {
      authorId: authorIdNum,
      content: content.trim(),
    },
  });

  console.log("Post successfully created!");
  return res.status(200).json({ msg: "Post successfully created!" });
});

router.get("/:id", async (req, res, next) => {
  const post = await prisma.posts.findUnique({ where: { id } });
  return res.send(post);
});

export default router;
