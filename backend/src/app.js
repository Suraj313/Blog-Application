import express from "express";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";


const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/test",testRoutes);
app.use("/categories", categoryRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);


export default app;
