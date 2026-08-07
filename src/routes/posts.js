import express from "express";
import prisma from "#/db.js";
import { loadPost, requirePostOwnerOrAdmin } from "#/middleware/posts.js";

const router = express.Router();

// Create new post
router.post("/", async (req, res, next) => {
  // Check body exists
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Body required" });
  }

  // Get authorId from auth to prevent IDOR vulnerability if authorId sent from body
  const authorId = Number(req.auth.id);

  const { content } = req.body;

  // If requested ID is not a number or content is not a string, reject
  if (
    typeof authorId !== "number" ||
    Number.isNaN(authorId) ||
    typeof content !== "string"
  ) {
    return res.status(400).json({ error: "Invalid authorId or content types" });
  }

  const post = await prisma.posts.create({
    data: {
      authorId: authorId,
      content: content.trim(),
    },
  });

  console.log("Post successfully created!");
  return res.status(201).json({ msg: "Post successfully created!", post });
});

// Get a post by ID
router.get(
  "/:id",
  loadPost,
  requirePostOwnerOrAdmin,
  async (req, res, next) => {
    const post = req.post;
    return res.send(post);
  },
);

router.patch(
  "/:id",
  loadPost,
  requirePostOwnerOrAdmin,
  async (req, res, next) => {
    const post = req.post;

    // Content to update post
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        error: "Content required or content should be a valid string",
      });
    }

    // Update the post
    const updatedPost = await prisma.posts.update({
      where: { id: post.id },
      data: { content: content },
    });

    return res.status(200).json(updatedPost);
  },
);

router.delete(
  "/:id",
  loadPost,
  requirePostOwnerOrAdmin,
  async (req, res, next) => {
    const post = req.post;

    // Delete the post
    const deletedPost = await prisma.posts.delete({
      where: { id: post.id },
    });

    // Return if successful
    return res
      .status(200)
      .json({ post: deletedPost, msg: `Post ${post.id} successfully deleted` });
  },
);

export default router;
