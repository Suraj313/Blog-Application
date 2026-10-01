import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  getUserProfile,
  uploadProfileImage,removeProfileImage
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);

router.put(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);
router.delete("/profile/image", protect, removeProfileImage);

export default router;
