import prisma from "./db.js";
import express from "express";

// Routes imports
import usersRoutes from "#/routes/users.js";
import authRoutes from "#/routes/auth.js";

// Middleware imports
import authMiddleware from "../middleware/auth.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authMiddleware);

// Route registration
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

// GET all users
app.get("/", async (req, res, next) => {
  const users = await prisma.users.findMany();
  console.log(users);
  res.send(users);
});

// POST
app.post("/", (req, res, next) => {
  console.log("POST request received");
  res.send("Here is your POST request");
});

// PUT
app.put("/", (req, res, next) => {
  console.log("PUT request received");
  res.send("Here is your PUT request");
});

// Delete
app.delete("/", (req, res, next) => {
  console.log("DELETE request received");
  res.send("Here is your DELETE request");
});

// Listen on port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
