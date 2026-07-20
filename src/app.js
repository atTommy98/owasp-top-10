import prisma from "./db.js";
import express from "express";
import usersRoutes from "#/routes/users.js";
import authRoutes from "#/routes/auth.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.get("/", async (req, res, next) => {
  const users = await prisma.user.findMany();
  console.log(users);
  res.send(users);
});

app.post("/", (req, res, next) => {
  console.log("POST request received");
  res.send("Here is your POST request");
});

app.put("/", (req, res, next) => {
  console.log("PUT request received");
  res.send("Here is your PUT request");
});

app.delete("/", (req, res, next) => {
  console.log("DELETE request received");
  res.send("Here is your DELETE request");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
