export default function authMiddleware(req, res, next) {
  console.log(`Auth Middleware:`);
  console.log(`Request Type: ${req.method}`);
  next();
}