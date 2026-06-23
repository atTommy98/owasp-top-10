import express from "express";
import prisma from "#/db.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json(user);
});

router.post("/", async (req, res, next) => {
  console.log(req.body)
  const user = await prisma.users.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
  });

  res.json(user);
});

export default router;
