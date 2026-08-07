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
  // Content to update post
  const { content } = req.body;
  console.log(content);

  // Validity check first before db request
  if (typeof id !== "number" || Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  // Who is requesting this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  // CHECK OWNERSHIP BEFORE UPDATING - Key difference between the GET and PATCH
  const post = await prisma.posts.findUnique({
    where: { id },
  });

  // If post doesn't exist, explicitly return error rather than having Prisma handle it
  if (!post) return res.status(404).json({ error: "Not Found" });

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === post.authorId;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`);

  // Forbidden if not admin or owner, success otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);

  // Update the post
  const update = await prisma.posts.update({
    where: { id },
    data: { content: content },
  });

  return res.status(200).json(post);
});

router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  // Validity check first before db request
  if (typeof id !== "number" || Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  // Who is requesting to delete this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  // CHECK OWNERSHIP BEFORE UPDATING - Key difference between the GET and DELETE
  const post = await prisma.posts.findUnique({
    where: { id },
  });

  // If post doesn't exist, explicitly return error rather than having Prisma handle it
  if (!post) return res.status(404).json({ error: "Not Found" });

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === post.authorId;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`);

  // Forbidden if not admin or owner, success otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);

  // Update the post
  const deletedPost = await prisma.posts.delete({
    where: { id },
  });

  return res.status(200).json(post);
});

export default router;
