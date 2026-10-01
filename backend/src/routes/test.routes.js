import express from "express";
import { protect} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/protected",protect,(req,res) => {
  res.json({
    message:"You accessed protected route",
    user:req.user,
  });
});

router.get("/admin", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;