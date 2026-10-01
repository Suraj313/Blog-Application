import express from 'express';
import { registerUser,loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/test", (req, res) => {
  res.send("Auth route working");
});


export default router;
