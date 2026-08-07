import prisma from "#/db.js";

export async function loadPost(req, res, next) {
  const id = Number(req.params.id);

  // Validity check first before db request
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a valid number" });
  }

  const post = await prisma.posts.findUnique({
    where: { id },
  });

  // If post doesn't exist, explicitly return error rather than having Prisma handle it
  if (!post) return res.status(404).json({ error: "Not Found" });

  req.post = post;

  return next();
}

export async function requirePostOwnerOrAdmin(req, res, next) {
  const post = req.post;

  if (!post) {
    console.error(
      "Ensure post is loaded before checking if requesting user is owner or admin",
    );
    return res.status(500).json({ error: "Post Not Found" });
  }

  // Who is requesting to delete this resource?
  const requestingUser = await prisma.users.findUnique({
    where: { id: req.auth.id },
  });

  if (!requestingUser)
    return res.status(401).json({ error: "Requesting User Not Found" });

  req.user = requestingUser;

  // Is requesting user admin or owner of the resource
  const isAdmin = requestingUser.role === "ADMIN";
  const isOwner = requestingUser.id === post.authorId;
  console.log(`Requesting user admin: ${isAdmin} and owner ${isOwner}`);

  // Forbidden if not admin or owner, continue otherwise
  if (!isAdmin && !isOwner) return res.sendStatus(403);

  return next();
}
