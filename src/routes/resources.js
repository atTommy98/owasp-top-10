import express from "express";
import prisma from "#/db.js";

const router = express.Router();

router.get("/user/:id", async (req, res, next) => {
  // Is the requested ID valid?
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Valid ID required" });
  }
  console.log(`ID ${id} is valid`)

  // Who is requesting this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  // Get user Information
  const userInformation = await prisma.users.findUnique({
    where: { id },
  });

  console.log(`User ${requestingUser.id} is requesting user ${userInformation.id}'s resource`)

  // Check user information exists
  if (!userInformation) return res.sendStatus(404);

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === userInformation.id;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`)

  // Forbidden if not admin or owner, success otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);
  if (isAdmin || isOwner) return res.send(userInformation);

  // If request passes through allow guard, deny by default
  return res.sendStatus(403)
});

export default router;
