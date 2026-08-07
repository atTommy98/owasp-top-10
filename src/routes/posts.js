import express from "express";
import prisma from "#/db.js";

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
  return res.status(201).json({ msg: "Post successfully created!" });
});

// Get a post by ID
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  // Validity check first before db request
  if (typeof id !== "number" || Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  // Who is requesting this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  const post = await prisma.posts.findUnique({ where: { id } });
  if (!post) return res.sendStatus(404);

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === post.authorId;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`);

  // Forbidden if not admin or owner, success otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);
  if (isAdmin || isOwner) return res.send(post);

  // Deny by default
  return res.sendStatus(403);
});

router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  const { content } = req.body;

  console.log(content);

  const update = await prisma.posts.update({
    where: { id },
    data: { content: content },
  });

  return res.status(200).json(update);

  // Validity check first before db request
  if (typeof id !== "number" || Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  // Who is requesting this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });
});

export default router;
