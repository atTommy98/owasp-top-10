import express from "express";

const router = express.Router();

// Login a user
router.post("/login", (req, res, next) => {

  console.log('User successfully logged in!')
  res.sendStatus(200);
});

export default router;
