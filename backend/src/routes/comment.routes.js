import express from "express";
import { addComment,getCommentsByPost,approveComment,deleteComment,getAllComments } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/post/:postId", getCommentsByPost);
router.put("/:id/approve", protect, isAdmin, approveComment);
router.delete("/:id", protect, isAdmin, deleteComment);
router.get("/", protect, isAdmin, getAllComments);

export default router;
