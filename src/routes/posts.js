import express from "express";
import prisma from "#/db.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  const post = await prisma.posts.findUnique({ where: { id } });
  return res.send(post);
});

export default router;