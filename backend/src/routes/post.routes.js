import express from "express";
import { protect, protectOptional } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();


router.post(
  "/",
  protect,
  upload.single("featuredImage"),
  createPost
);

router.get(
  "/",
  protectOptional,
  getAllPosts
);


router.get(
  "/:id",
  getSinglePost
);


router.put(
  "/:id",
  protect,
  isAdmin,
  updatePost
);


router.delete(
  "/:id",
  protect,
  isAdmin,
  deletePost
);

export default router;
