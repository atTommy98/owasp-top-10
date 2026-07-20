import express from "express";
import prisma from "#/db.js";
import util from "util";

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

  console.log(req.auth.id);

  try {
    const requestingUser = await prisma.users.findUnique({
      where: { id: req.auth.id },
    });

    console.log(`Requesting user: ${requestingUser}`);

    if (requestingUser.role !== "ADMIN") {
      console.log("User does not have permission.");
      return res.sendStatus(403);
    } else {
      console.log("User will be deleted.");
      return res.sendStatus(200);
    }
  } catch (err) {
    console.error(err);
  }
});

export default router;
