import express from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getDashboardStats);

export default router;
