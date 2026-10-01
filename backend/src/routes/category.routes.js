import express from "express";
import { createCategory } from "../controllers/category.controller.js";
import { getAllCategories,updateCategory,deleteCategory } from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createCategory);
router.get("/", getAllCategories);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
