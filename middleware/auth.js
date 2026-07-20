import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
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
