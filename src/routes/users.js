import express from "express";
import prisma from "#/db.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  console.log(`Requested ID to GET: ${id}`);
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  res.json(user);
});

router.post("/", async (req, res, next) => {
  console.log(
    `Creating new user: ${req.body.name} with email ${req.body.email}`,
  );

  // Currently anyone can create a user, only admins should be able to
  const user = await prisma.users.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });

  res.json(user);
});

router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  console.log(`Requested ID to DEL: ${id}`);
  const deletedUser = await prisma.users.delete({
    where: {
      id
    }
  })

  res.json(deletedUser)
})

export default router;
