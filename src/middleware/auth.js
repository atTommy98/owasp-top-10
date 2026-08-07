import jwt from "jsonwebtoken";
import prisma from "#/db.js";

export function authMiddleware(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;

  try {
    const authHeader = req.headers.authorization;
    const authHeaderSplit = authHeader.split(" ");
    const token = authHeaderSplit[1];
    const verifiedToken = jwt.verify(token, jwtSecret);

    req.auth = verifiedToken;

    next();
  } catch {
    return res.sendStatus(401);
  }
}

export async function requireOwnerOrAdmin(req, res, next) {
  const post = req.post;

  if (!post) {
    console.error(
      "Ensure post is loaded before checking if requesting user is owner or admin",
    );
    return res.status(404).json({ error: "Post Not Found" });
  }

  // Who is requesting to delete this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  if (!requestingUser)
    return res.status(404).json({ error: "Requesting User Not Found" });

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === post.authorId;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`);

  // Forbidden if not admin or owner, continue otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);

  return next();
}
